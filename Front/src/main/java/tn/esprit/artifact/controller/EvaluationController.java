package tn.esprit.artifact.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.artifact.entity.Evaluation;
import tn.esprit.artifact.entity.EvaluationType;
import tn.esprit.artifact.service.IEvaluationService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EvaluationController {
    @Autowired
    IEvaluationService evaluationService;

    @PostMapping("/evaluation")
    public ResponseEntity<Evaluation> addEvaluation(@RequestBody Evaluation evaluation) {
        Evaluation addedEvaluation = evaluationService.createEvaluation(evaluation);
        return new ResponseEntity<>(addedEvaluation, HttpStatus.CREATED);
    }

    @GetMapping("/evaluation/{evaluationId}")
    public ResponseEntity<Evaluation> showEvaluationByid(@PathVariable Long evaluationId) {
        Evaluation evaluation = evaluationService.getEvaluationById(evaluationId);
        if (evaluation != null) {
            return ResponseEntity.ok(evaluation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/evaluation")
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        List<Evaluation> evaluations = evaluationService.getAllEvaluations();
        return ResponseEntity.ok(evaluations);
    }

    @PutMapping("/evaluation/{evaluationId}")
    public ResponseEntity<Evaluation> updateEvaluation(@PathVariable("evaluationId") Long evaluationId, @RequestBody Evaluation updatedEvaluation) {
        try {
            Evaluation updated = evaluationService.updateEvaluation(evaluationId, updatedEvaluation);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/evaluation/{evaluationId}")
    public ResponseEntity<Void> deleteEvaluation(@PathVariable Long evaluationId) {
        try {
            Evaluation deletedEvaluation = evaluationService.deleteEvaluation(evaluationId);

            // Create the response message
            String message = "Evaluation with ID " + evaluationId + " deleted successfully.";

            // Create the response headers
            HttpHeaders headers = new HttpHeaders();
            headers.add("Message", message);
            // Return the response entity with the response object and status OK
            return new ResponseEntity<>(headers, HttpStatus.OK);
        }

        catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/evaluation/find-user-competence")//forUser
    public ResponseEntity<List<Evaluation>> findByUserIdAndCompetenceIdAndEval(
            @RequestParam Long userId,
            @RequestParam Long compId,
            @RequestParam EvaluationType eval) {
        List<Evaluation> evaluations = evaluationService.findByUserIdAndCompetenceIdAndEval(userId, compId, eval);
        return ResponseEntity.ok(evaluations);
    }

    @GetMapping("/evaluation/find-user-allcompetence")
    public ResponseEntity<List<Evaluation>> findByUserIdAndCompetenceId(
            @RequestParam Long userId,
            @RequestParam Long compId)
             {
        List<Evaluation> evaluations = evaluationService.findByUserIdAndCompetenceId(userId, compId);
        return ResponseEntity.ok(evaluations);
    }

    @DeleteMapping("/evaluation/delete-by-user/{userId}")
    public ResponseEntity<String> deleteEvaluationsByUser(@PathVariable Long userId) {
        evaluationService.deleteEvaluationsByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/evaluation/find-user-allcompetence-withouforuser")
    public List<Evaluation> getEvaluationsByUserIdAndCompetenceId(
            @RequestParam Long userId,
            @RequestParam Long competenceId) {
        return evaluationService.getAllEvaluationsByUserIdAndCompetenceIdWithoutForUser(userId, competenceId);
    }

    @PostMapping("/evaluation/calculate-note-competence")
    public ResponseEntity<Double> calculateAndAssignAverageNote(
            @RequestParam Long userId,
            @RequestParam Long competenceId) {

        Double averageNote = evaluationService.calculateAndAssignAverageNote(userId, competenceId);
        return ResponseEntity.ok(averageNote);
    }



}

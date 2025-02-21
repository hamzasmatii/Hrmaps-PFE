package tn.esprit.artifact.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.artifact.entity.Competence;
import tn.esprit.artifact.service.ICompetenceService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CompetenceController {
    @Autowired
    ICompetenceService competenceService;

    @PostMapping("/competence")
    public ResponseEntity<Competence> addCompetence(@RequestBody Competence competence) {
        Competence addedCompetence = competenceService.createCompetence(competence);
        return new ResponseEntity<>(addedCompetence, HttpStatus.CREATED);
    }

    @GetMapping("/competence/{competenceId}")
    public ResponseEntity<Competence> showCompetenceByid(@PathVariable Long competenceId) {
        Competence competence = competenceService.getCompetenceById(competenceId);
        if (competence != null) {
            return ResponseEntity.ok(competence);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/competence")
    public ResponseEntity<List<Competence>> getAllCompetences() {
        List<Competence> competences = competenceService.getAllCompetences();
        return ResponseEntity.ok(competences);
    }

    @PutMapping("/competence/{competenceId}")
    public ResponseEntity<Competence> updateCompetence(@PathVariable("competenceId") Long competenceId, @RequestBody Competence updatedCompetence) {
        try {
            Competence updated = competenceService.updateCompetence(competenceId, updatedCompetence);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/competence/{competenceId}")
    public ResponseEntity<Void> deleteCompetence(@PathVariable Long competenceId) {
        try {
            Competence deletedCompetence = competenceService.deleteCompetence(competenceId);

            // Create the response message
            String message = "Competence with ID " + competenceId + " deleted successfully.";

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

    @GetMapping("/competence/by-poste/{jobPositionId}")
    public List<Competence> getCompetencesByJobPositionId(@PathVariable Long jobPositionId) {
        return competenceService.getCompetencesByJobPositionId(jobPositionId);
    }



}

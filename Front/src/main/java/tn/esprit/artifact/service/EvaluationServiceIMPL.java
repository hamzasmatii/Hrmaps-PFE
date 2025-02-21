package tn.esprit.artifact.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.artifact.entity.Evaluation;
import tn.esprit.artifact.entity.EvaluationType;
import tn.esprit.artifact.repository.EvaluationRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class EvaluationServiceIMPL implements IEvaluationService{
    @Autowired
    private EvaluationRepository evaluationRepository;

    @Override
    public Evaluation createEvaluation(Evaluation evaluation) {

        // Convert datedebut to LocalDate
        LocalDateTime datedebut = LocalDateTime.now();
        Date dateEvaluAsDate = Date.from(datedebut.atZone(ZoneId.systemDefault()).toInstant());
        evaluation.calculNote();

        evaluation.setDateEvalu(dateEvaluAsDate);
        return evaluationRepository.save(evaluation);
    }

    @Override
    public Evaluation updateEvaluation(Long id, Evaluation evaluation) {
        Optional<Evaluation> optionalEvaluation = evaluationRepository.findById(id);

        if (optionalEvaluation.isPresent()) {
            Evaluation existingEvaluation = optionalEvaluation.get();

            // Update fields only if they are not null
            if (evaluation.getEval() != null) {
                existingEvaluation.setEval(evaluation.getEval());
                existingEvaluation.calculNote(); // Recalculate the note based on the new eval
            }else {
                existingEvaluation.setEval(null);
                existingEvaluation.calculNote();// Or handle as appropriate if null should be explicitly set
            }
            if (evaluation.getCompetence() != null) {
                existingEvaluation.setCompetence(evaluation.getCompetence());
            }
            if (evaluation.getUser() != null) {
                existingEvaluation.setUser(evaluation.getUser());
            }else {
                existingEvaluation.setUser(null); // Or handle as appropriate if null should be explicitly set
            }



            // Save the updated evaluation entity
            return evaluationRepository.save(existingEvaluation);
        } else {
            // Handle the case where the evaluation with the given ID is not found
            throw new IllegalArgumentException("Evaluation not found with ID: " + id);
        }
    }


    @Override
    public List<Evaluation> getAllEvaluations() {
        Iterable<Evaluation> evaluationsIterable = evaluationRepository.findAll();
        List<Evaluation> evaluationsList = new ArrayList<>();
        for (Evaluation evaluation : evaluationsIterable) {
            evaluationsList.add(evaluation);
        }
        return evaluationsList;
    }

    @Override
    public Evaluation getEvaluationById(Long id) {
        return evaluationRepository.findById(id).orElse(null);
    }

    @Override
    public Evaluation deleteEvaluation(Long id) {
        try{
            Optional<Evaluation> optionalEvaluation = evaluationRepository.findById(id);



            // If the evaluation exists, retrieve it
            Evaluation evaluationToDelete = optionalEvaluation.get();

            // Delete the evaluation by its ID
            evaluationRepository.deleteById(id);

            // Return the deleted stage
            return evaluationToDelete;
        } catch(Exception e) {
            // If the stage does not exist, throw an exception or handle it in any other appropriate way
            throw new IllegalArgumentException("evaluation not found");
        }

    }

    @Override
    public List<Evaluation> findByUserIdAndCompetenceIdAndEval(Long userId, Long competenceId, EvaluationType eval) {
        return evaluationRepository.findByUserIdAndCompetenceIdAndEval(userId, competenceId, eval);
    }

    @Override
    public List<Evaluation> findByUserIdAndCompetenceId(Long userId, Long competenceId) {
        return evaluationRepository.findByUserIdAndCompetenceId(userId, competenceId);
    }
    @Transactional
    @Override
    public void deleteEvaluationsByUserId(Long userId) {
        evaluationRepository.deleteByUserId(userId);
    }

    @Override
    public List<Evaluation> getAllEvaluationsByUserIdAndCompetenceIdWithoutForUser(Long userId, Long competenceId) {
        return evaluationRepository.findAllByUserIdAndCompetenceIdAndEvalNotForUser(userId, competenceId);
    }

    @Override
    public Double calculateAndAssignAverageNote(Long userId, Long competenceId) {
        // Step 1: Get all evaluations excluding 'FORUSER'
        List<Evaluation> evaluations = evaluationRepository.findAllByUserIdAndCompetenceIdAndEvalNotForUser(userId, competenceId);

        // Step 2: Calculate the average note
        double averageNote = evaluations.stream()
                .filter(evaluation -> evaluation.getNote() != null)
                .mapToDouble(Evaluation::getNote)
                .average()
                .orElse(0.0);  // Default to 0 if there are no evaluations

        // Step 3: Find the existing FORUSER evaluation
        Optional<Evaluation> forUserEvaluationOpt = evaluationRepository.findByUserIdAndCompetenceIdAndEval(userId, competenceId, EvaluationType.FORUSER)
                .stream()
                .findFirst();

        // Step 4: If FORUSER evaluation exists, assign the calculated average note
        if (forUserEvaluationOpt.isPresent()) {
            Evaluation forUserEvaluation = forUserEvaluationOpt.get();
            forUserEvaluation.setNote(averageNote); // Assign the exact average note without rounding
            evaluationRepository.save(forUserEvaluation);
        } else {
            // Handle the case where no FORUSER evaluation exists, if necessary
            // For example, log a warning or throw an exception
            System.out.println("No FORUSER evaluation found for userId: " + userId + " and competenceId: " + competenceId);
        }

        // Step 5: Return the calculated average note
        return averageNote;
    }


}

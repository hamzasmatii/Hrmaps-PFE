package tn.esprit.artifact.service;

import tn.esprit.artifact.entity.Evaluation;
import tn.esprit.artifact.entity.EvaluationType;

import java.util.List;

public interface IEvaluationService {
    Evaluation createEvaluation(Evaluation Evaluation);

    Evaluation updateEvaluation(Long id, Evaluation Evaluation);

    List<Evaluation> getAllEvaluations();

    Evaluation getEvaluationById(Long id);

    Evaluation deleteEvaluation(Long id);

     List<Evaluation> findByUserIdAndCompetenceIdAndEval(Long userId, Long competenceId, EvaluationType eval) ;

     List<Evaluation> findByUserIdAndCompetenceId(Long userId, Long competenceId);

     void deleteEvaluationsByUserId(Long userId);
     List<Evaluation> getAllEvaluationsByUserIdAndCompetenceIdWithoutForUser(Long userId, Long competenceId);
      Double calculateAndAssignAverageNote(Long userId, Long competenceId);
}

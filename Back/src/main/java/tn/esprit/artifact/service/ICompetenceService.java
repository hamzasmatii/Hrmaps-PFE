package tn.esprit.artifact.service;

import tn.esprit.artifact.entity.Competence;

import java.util.List;
import java.util.Optional;

public interface ICompetenceService {
    Competence createCompetence(Competence Competence);

    Competence updateCompetence(Long id, Competence Competence);

    List<Competence> getAllCompetences();

    Competence getCompetenceById(Long id);

    Competence deleteCompetence(Long id);

     List<Competence> getCompetencesByJobPositionId(Long jobPositionId);
}

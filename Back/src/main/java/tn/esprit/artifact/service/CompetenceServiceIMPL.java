package tn.esprit.artifact.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.artifact.entity.Competence;
import tn.esprit.artifact.repository.CompetenceRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class CompetenceServiceIMPL implements ICompetenceService{
    @Autowired
    private CompetenceRepository competenceRepository;

    @Override
    public Competence createCompetence(Competence competence) {
        return competenceRepository.save(competence);
    }

    @Override
    public Competence updateCompetence(Long id, Competence competence) {
        Optional<Competence> optionalCompetence = competenceRepository.findById(id);

        if (optionalCompetence.isPresent()) {
            Competence existingCompetence = optionalCompetence.get();

            // Update fields only if they are not null
            if (competence.getDescription() != null) {
                existingCompetence.setDescription(competence.getDescription());
            }

            if (competence.getNom() != null) {
                existingCompetence.setNom(competence.getNom());
            }

            if (competence.getJobPosition() != null) {
                existingCompetence.setJobPosition(competence.getJobPosition());
            } else {
                existingCompetence.setJobPosition(null); // Or handle as appropriate if null should be explicitly set
            }

            // Update Evaluations if it's not null
            if (competence.getEvaluations() != null) {
                existingCompetence.setEvaluations(competence.getEvaluations());
            } else {
                existingCompetence.setEvaluations(new HashSet<>()); // Or handle as appropriate if null should be explicitly set
            }

            // Save the updated competence entity
            return competenceRepository.save(existingCompetence);
        } else {
            // Handle the case where the competence with the given ID is not found
            throw new IllegalArgumentException("Competence not found with ID: " + id);
        }
    }


    @Override
    public List<Competence> getAllCompetences() {
        Iterable<Competence> competencesIterable = competenceRepository.findAll();
        List<Competence> competencesList = new ArrayList<>();
        for (Competence competence : competencesIterable) {
            competencesList.add(competence);
        }
        return competencesList;
    }

    @Override
    public Competence getCompetenceById(Long id) {
        return competenceRepository.findById(id).orElse(null);
    }

    @Override
    public Competence deleteCompetence(Long id) {
        try{
            Optional<Competence> optionalCompetence = competenceRepository.findById(id);



            // If the competence exists, retrieve it
            Competence competenceToDelete = optionalCompetence.get();

            // Delete the competence by its ID
            competenceRepository.deleteById(id);

            // Return the deleted stage
            return competenceToDelete;
        } catch(Exception e) {
            // If the stage does not exist, throw an exception or handle it in any other appropriate way
            throw new IllegalArgumentException("competence not found");
        }

    }

    @Override
    public List<Competence> getCompetencesByJobPositionId(Long jobPositionId) {
        return competenceRepository.findByJobPositionId(jobPositionId);
    }
}

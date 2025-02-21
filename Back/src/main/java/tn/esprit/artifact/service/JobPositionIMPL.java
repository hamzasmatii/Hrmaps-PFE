package tn.esprit.artifact.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.artifact.entity.Competence;
import tn.esprit.artifact.entity.Evaluation;
import tn.esprit.artifact.entity.JobPosition;
import tn.esprit.artifact.entity.User;
import tn.esprit.artifact.repository.JobPositionRepository;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class JobPositionIMPL implements IJobPositionService{
    @Autowired
    private JobPositionRepository jobpositionRepository;

    @Override
    public JobPosition createJobPosition(JobPosition jobposition) {
        return jobpositionRepository.save(jobposition);
    }

    @Override
    public JobPosition updateJobPosition(Long id, JobPosition jobposition) {
        Optional<JobPosition> optionalJobPosition = jobpositionRepository.findById(id);

        if (optionalJobPosition.isPresent()) {
            JobPosition existingJobPosition = optionalJobPosition.get();

            // Update fields only if they are not null
            if (jobposition.getDescription() != null) {
                existingJobPosition.setDescription(jobposition.getDescription());
            }else {
                existingJobPosition.setDescription(null); // Or handle as appropriate if null should be explicitly set
            }
            if (jobposition.getNom() != null) {
                existingJobPosition.setNom(jobposition.getNom());
            }else {
                existingJobPosition.setNom(null); // Or handle as appropriate if null should be explicitly set
            }

            if (jobposition.getCompetencesRequises() != null) {
                existingJobPosition.setCompetencesRequises(jobposition.getCompetencesRequises());
            } else {
                existingJobPosition.setCompetencesRequises(new HashSet<>()); // Or handle as appropriate if null should be explicitly set
            }


            // Save the updated job position entity
            return jobpositionRepository.save(existingJobPosition);
        } else {
            // Handle the case where the job position with the given ID is not found
            throw new IllegalArgumentException("JobPosition not found with ID: " + id);
        }
    }


    @Override
    public List<JobPosition> getAllJobPositions() {
        Iterable<JobPosition> jobpositionsIterable = jobpositionRepository.findAll();
        List<JobPosition> jobpositionsList = new ArrayList<>();
        for (JobPosition jobposition : jobpositionsIterable) {
            jobpositionsList.add(jobposition);
        }
        return jobpositionsList;
    }

    @Override
    public JobPosition getJobPositionById(Long id) {
        return jobpositionRepository.findById(id).orElse(null);
    }

    @Override
    public JobPosition deleteJobPosition(Long id) {
        try{
            Optional<JobPosition> optionalJobPosition = jobpositionRepository.findById(id);



            // If the jobposition exists, retrieve it
            JobPosition jobpositionToDelete = optionalJobPosition.get();

            // Delete the jobposition by its ID
            jobpositionRepository.deleteById(id);

            // Return the deleted stage
            return jobpositionToDelete;
        } catch(Exception e) {
            // If the stage does not exist, throw an exception or handle it in any other appropriate way
            throw new IllegalArgumentException("jobposition not found");
        }

    }

    @Override
    public Set<User> getUsersForJobPosition(Long posteId) {
        // Fetch JobPosition by ID
        JobPosition jobPosition = jobpositionRepository.findById(posteId)
                .orElseThrow(() -> new RuntimeException("JobPosition not found"));

        // Get Competences related to the JobPosition
        Set<Competence> competences = jobPosition.getCompetencesRequises();

        // Get Users who have evaluations for the Competences
        Set<User> users = new HashSet<>();
        for (Competence competence : competences) {
            Set<Evaluation> evaluations = competence.getEvaluations();
            for (Evaluation evaluation : evaluations) {
                users.add(evaluation.getUser());
            }
        }

        return users;
    }
}

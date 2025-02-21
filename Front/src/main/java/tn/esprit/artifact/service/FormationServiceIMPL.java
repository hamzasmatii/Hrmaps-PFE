package tn.esprit.artifact.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.artifact.entity.Formation;
import tn.esprit.artifact.entity.Formation;
import tn.esprit.artifact.entity.User;
import tn.esprit.artifact.repository.FormationRepository;
import tn.esprit.artifact.repository.FormationRepository;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class FormationServiceIMPL implements IFormationService {
    @Autowired
    private FormationRepository formationRepository;

    @Override
    public Formation createFormation(Formation formation) {
        return formationRepository.save(formation);
    }

    @Override
    public Formation updateFormation(Long id, Formation formation) {
        Optional<Formation> optionalFormation = formationRepository.findById(id);

        if (optionalFormation.isPresent()) {
            Formation existingFormation = optionalFormation.get();

            // Update fields only if they are not null
            if (formation.getNom() != null) {
                existingFormation.setNom(formation.getNom());
            }else {
                existingFormation.setNom(null); // Or handle as appropriate if null should be explicitly set
            }
            if (formation.getDateDebut() != null) {
                existingFormation.setDateDebut(formation.getDateDebut());
            }else {
                existingFormation.setDateDebut(null); // Or handle as appropriate if null should be explicitly set
            }
            if (formation.getDateFin() != null) {
                existingFormation.setDateFin(formation.getDateFin());
            }else {
                existingFormation.setDateFin(null); // Or handle as appropriate if null should be explicitly set
            }

            if (formation.getUsers() != null) {
                existingFormation.setUsers(formation.getUsers());
            } else {
                existingFormation.setUsers(new HashSet<>()); // Or handle as appropriate if null should be explicitly set
            }


            // Save the updated job position entity
            return formationRepository.save(existingFormation);
        } else {
            // Handle the case where the job position with the given ID is not found
            throw new IllegalArgumentException("formation not found with ID: " + id);
        }
    }

    @Override
    public List<Formation> getAllFormations() {
        Iterable<Formation> formationsIterable = formationRepository.findAll();
        List<Formation> formationsList = new ArrayList<>();
        for (Formation formation : formationsIterable) {
            formationsList.add(formation);
        }
        return formationsList;
    }

    @Override
    public Formation getFormationById(Long id) {
        return formationRepository.findById(id).orElse(null);
    }

    @Override
    public Formation deleteFormation(Long id) {
        try{
            Optional<Formation> optionalFormation = formationRepository.findById(id);



            // If the formation exists, retrieve it
            Formation formationToDelete = optionalFormation.get();

            // Delete the formation by its ID
            formationRepository.deleteById(id);

            // Return the deleted stage
            return formationToDelete;
        } catch(Exception e) {
            // If the stage does not exist, throw an exception or handle it in any other appropriate way
            throw new IllegalArgumentException("formation not found");
        }
    }

    @Override
    public Set<User> getUsersForFormation(Long posteId) {
        return null;
    }

    @Override
    public List<Formation> getFormationsByUserId(Long userId) {
        return formationRepository.findFormationsByUserId(userId);
    }
}

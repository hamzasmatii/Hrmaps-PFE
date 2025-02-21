package tn.esprit.artifact.service;

import tn.esprit.artifact.entity.Formation;
import tn.esprit.artifact.entity.User;

import java.util.List;
import java.util.Set;

public interface IFormationService {
    
    Formation createFormation(Formation Formation);

    Formation updateFormation(Long id, Formation Formation);

    List<Formation> getAllFormations();

    Formation getFormationById(Long id);

    Formation deleteFormation(Long id);

    Set<User> getUsersForFormation(Long posteId);

     List<Formation> getFormationsByUserId(Long userId);
}

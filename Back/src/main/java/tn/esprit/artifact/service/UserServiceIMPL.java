package tn.esprit.artifact.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.artifact.entity.*;
import tn.esprit.artifact.repository.EvaluationRepository;
import tn.esprit.artifact.repository.UserRepository;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class UserServiceIMPL implements IUserService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public User createUser(User user) {
        user.setNotePoste(0.0);
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            // Update fields only if they are not null

            if (user.getMdp() != null) {
                existingUser.setMdp(user.getMdp());
            }
            if (user.getEmail() != null) {
                existingUser.setEmail(user.getEmail());
            }
            if (user.getNumber() != null) {
                existingUser.setNumber(user.getNumber());
            }
            if (user.getNom() != null) {
                existingUser.setNom(user.getNom());
            }
            if (user.getPrenom() != null) {
                existingUser.setPrenom(user.getPrenom());
            }
            if (user.getType() != null) {
                existingUser.setType(user.getType());
            }

            if (user.getEvaluations() != null) {
                existingUser.setEvaluations(user.getEvaluations());
            }else{
                existingUser.setEvaluations(new HashSet<>());
            }

            if (user.getServiceEq() != null) {
                existingUser.setServiceEq(user.getServiceEq());
            }else{
                existingUser.setServiceEq(null);

            }if (user.getFormation() != null) {
                existingUser.setFormation(user.getFormation());
            } else {
                existingUser.setFormation(new HashSet<>()); // Or handle as appropriate if null should be explicitly set
            }

           /* if (user.getChefEquipeService() != null) {
                existingUser.setChefEquipeService(user.getChefEquipeService());
            }else{
                existingUser.setServiceEq(null);

            }*/


            // Save the updated user entity
            return userRepository.save(existingUser);
        } else {
            // Handle the case where the user with the given ID is not found
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
    }


    @Override
    public List<User> getAllUsers() {
        Iterable<User> usersIterable = userRepository.findAll();
        List<User> usersList = new ArrayList<>();
        for (User user : usersIterable) {
            usersList.add(user);
        }
        return usersList;
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User deleteUser(Long id) {
        try{
            Optional<User> optionalUser = userRepository.findById(id);



            // If the user exists, retrieve it
            User userToDelete = optionalUser.get();

            // Delete the user by its ID
            userRepository.deleteById(id);

            // Return the deleted stage
            return userToDelete;
        } catch(Exception e) {
            // If the stage does not exist, throw an exception or handle it in any other appropriate way
            throw new IllegalArgumentException("user not found");
        }

    }

    @Override
    public User login(String identifiant, String password) {
        User user = userRepository.findUsersByIdentifiantUser(identifiant);
        if (user != null && user.getMdp().equals(password)) {
            return user;
        }
        return null;
    }

    @Override
    public List<User> findUsersByServiceEq(Long id) {
        List<User> user = userRepository.findUsersByServiceEqId(id);
        if (user != null ) {
            return user;
        }
        return null;
    }
    @Override
    public ServiceEq getServiceEqByUserId(Long userId) {
        // Recherchez l'utilisateur par son ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Renvoyer l'objet ServiceEq associé
        return user.getServiceEq();
    }
    @Override
    public List<User> getChefsWithoutServiceEq() {
        return userRepository.findChefsWithoutServiceEq(UserType.CHEF_EQUIPE);
    }
    @Override
    public List<User> getUsersWithoutServiceEq() {
        return userRepository.findUsersWithoutServiceEq(UserType.EMPLOYE);
    }


    @Override
    public JobPosition getJobPositionFromUserId(Long userId) {
        // Retrieve all evaluations of type FORUSER for the given user
        List<Evaluation> evaluations = evaluationRepository.findByUserIdAndEval(userId, EvaluationType.FORUSER);

        if (evaluations.isEmpty()) {
            // Handle the case where no evaluations are found
            return null; // or return new JobPosition();
        }

        // Create a new JobPosition object to return
        JobPosition jobPositionToReturn = new JobPosition();

        // Create a Set to hold all unique competences related to the evaluations
        Set<Competence> filteredCompetences = new HashSet<>();

        double totalNotes = 0.0;
        int noteCount = 0;

        // Iterate over all evaluations
        for (Evaluation evaluation : evaluations) {
            Competence competence = evaluation.getCompetence();
            if (competence != null) {
                filteredCompetences.add(competence);

                // Set the basic job position details from the first evaluation's job position
                if (jobPositionToReturn.getId() == null) {
                    JobPosition originalJobPosition = competence.getJobPosition();
                    if (originalJobPosition != null) {
                        jobPositionToReturn.setId(originalJobPosition.getId());
                        jobPositionToReturn.setNom(originalJobPosition.getNom());
                        jobPositionToReturn.setDescription(originalJobPosition.getDescription());
                    }
                }

                // Accumulate the notes for the competencies
                Double note = evaluation.getNote();
                if (note != null) {
                    totalNotes += note;
                    noteCount++;
                }
            }
        }

        // Set the collected competences to the JobPosition object
        jobPositionToReturn.setCompetencesRequises(filteredCompetences);

        // Calculate the average note
        double averageNote = (noteCount > 0) ? totalNotes / noteCount : 0.00;

        // Assign the calculated average note to user.notePoste
        User user = evaluations.get(0).getUser();
        if (user != null) {
            user.setNotePoste(averageNote); // Assuming User has a setNotePoste method
            userRepository.save(user); // Persist the changes to the user
        }

        return jobPositionToReturn;
    }

    @Override
    public List<User> getUsersByFormationId(Long formationId) {
        return userRepository.findUsersByFormationId(formationId);
    }


}

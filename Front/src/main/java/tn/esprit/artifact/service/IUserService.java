package tn.esprit.artifact.service;

import tn.esprit.artifact.entity.JobPosition;
import tn.esprit.artifact.entity.ServiceEq;
import tn.esprit.artifact.entity.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    User createUser(User user);

    User updateUser(Long id, User user);

    List<User> getAllUsers();

    User getUserById(Long id);

    User deleteUser(Long id);

     User login(String identifiant, String password);

     List<User> findUsersByServiceEq(Long id);

     ServiceEq getServiceEqByUserId(Long userId);

     List<User> getChefsWithoutServiceEq();

     List<User> getUsersWithoutServiceEq();

     JobPosition getJobPositionFromUserId(Long userId);

     List<User> getUsersByFormationId(Long formationId);
}

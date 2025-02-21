package tn.esprit.artifact.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.artifact.entity.ServiceEq;
import tn.esprit.artifact.entity.User;
import tn.esprit.artifact.repository.ServiceEqRepository;
import tn.esprit.artifact.repository.UserRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class ServiceEqIMPL implements IServiceEqService {
    @Autowired
    private ServiceEqRepository serviceEqRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ServiceEq createServiceEq(ServiceEq serviceEq) {
        return serviceEqRepository.save(serviceEq);
    }

    @Override
    public ServiceEq updateServiceEq(Long id, ServiceEq serviceEq) {
        Optional<ServiceEq> optionalServiceEq = serviceEqRepository.findById(id);

        if (optionalServiceEq.isPresent()) {
            ServiceEq existingServiceEq = optionalServiceEq.get();

            // Update fields only if they are not null
            if (serviceEq.getNom() != null) {
                existingServiceEq.setNom(serviceEq.getNom());
            }

            if (serviceEq.getChefEquipe() != null) {
                existingServiceEq.setChefEquipe(serviceEq.getChefEquipe());
            } else {
                existingServiceEq.setChefEquipe(null);
            }



            if (serviceEq.getEmployes() != null) {
                existingServiceEq.setEmployes(serviceEq.getEmployes());
            } else {
                existingServiceEq.setEmployes(new HashSet<>()); // Set to empty set if null
            }


            // Save the updated serviceEq entity
            return serviceEqRepository.save(existingServiceEq);
        } else {
            // Handle the case where the serviceEq with the given ID is not found
            throw new IllegalArgumentException("ServiceEq not found with ID: " + id);
        }
    }


    @Override
    public List<ServiceEq> getAllServiceEqs() {
        Iterable<ServiceEq> teamsIterable = serviceEqRepository.findAll();
        List<ServiceEq> teamsList = new ArrayList<>();
        for (ServiceEq serviceEq : teamsIterable) {
            teamsList.add(serviceEq);
        }
        return teamsList;
    }

    @Override
    public ServiceEq getServiceEqById(Long id) {
        return serviceEqRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public ServiceEq deleteServiceEq(Long id) {
        try {
            // Find the ServiceEq by ID
            Optional<ServiceEq> optionalServiceEq = serviceEqRepository.findById(id);

            // If the ServiceEq does not exist, throw an exception
            if (!optionalServiceEq.isPresent()) {
                throw new IllegalArgumentException("ServiceEq not found");
            }

            // Retrieve the ServiceEq entity
            ServiceEq serviceEqToDelete = optionalServiceEq.get();

            // Step 1: Find all users associated with this ServiceEq ID
            List<User> users = userRepository.findUsersByServiceEqId(id);

            // Step 2: Update each user to set serviceEq to null
            for (User user : users) {
                user.setServiceEq(null);
                userRepository.save(user);
            }

            // Step 3: Delete the ServiceEq
            serviceEqRepository.deleteById(id);

            // Return the deleted ServiceEq
            return serviceEqToDelete;
        } catch (Exception e) {
            // Handle exceptions appropriately
            throw new IllegalArgumentException("Error deleting ServiceEq: " + e.getMessage());
        }
    }



    public ServiceEq getServiceEqByUserId(Long userId) {
        return serviceEqRepository.findByUserId(userId);
    }
    public ServiceEq getServiceEqByChefId(Long userId) {
        return serviceEqRepository.findByChefId(userId);
    }
}

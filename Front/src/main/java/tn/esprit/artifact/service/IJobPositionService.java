package tn.esprit.artifact.service;

import tn.esprit.artifact.entity.JobPosition;
import tn.esprit.artifact.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IJobPositionService {
    JobPosition createJobPosition(JobPosition JobPosition);

    JobPosition updateJobPosition(Long id, JobPosition JobPosition);

    List<JobPosition> getAllJobPositions();

    JobPosition getJobPositionById(Long id);

    JobPosition deleteJobPosition(Long id);

     Set<User> getUsersForJobPosition(Long posteId);
}

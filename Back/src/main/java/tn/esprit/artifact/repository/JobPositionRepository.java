package tn.esprit.artifact.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.artifact.entity.JobPosition;

@Repository

public interface JobPositionRepository extends JpaRepository<JobPosition,Long>  {

}

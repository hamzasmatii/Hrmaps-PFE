package tn.esprit.artifact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.artifact.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}

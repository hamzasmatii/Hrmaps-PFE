package tn.esprit.artifact.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.artifact.entity.Notification;
import tn.esprit.artifact.entity.User;
import tn.esprit.artifact.repository.NotificationRepository;
import tn.esprit.artifact.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements INotificationService {
    @Autowired
    private NotificationRepository notificationRepository;


    @Autowired
    private UserRepository userRepository;

    @Override
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Override
    public void markAsUnread(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setRead(false);
            notificationRepository.save(notification);
        }
    }

    @Override
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findAll().stream()
                .filter(notification -> notification.getUsers().stream()
                        .anyMatch(user -> user.getId().equals(userId)))
                .collect(Collectors.toList());
    }

    @Override
    public void setAllNotificationsAsReadByUserId(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<Notification> notifications = notificationRepository.findAll().stream()
                    .filter(notification -> notification.getUsers().contains(user))
                    .collect(Collectors.toList());

            notifications.forEach(notification -> notification.setRead(true));
            notificationRepository.saveAll(notifications);
        }
    }

}
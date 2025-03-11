package tn.esprit.artifact.service;

import tn.esprit.artifact.entity.Notification;

import java.util.List;

public interface INotificationService {
    Notification createNotification(Notification notification);

    List<Notification> getAllNotifications();

    Notification getNotificationById(Long id);

    void deleteNotification(Long id);

    void markAsRead(Long id);

    void markAsUnread(Long id);

    List<Notification> getNotificationsByUserId(Long userId);

    void setAllNotificationsAsReadByUserId(Long userId);


}
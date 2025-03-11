package tn.esprit.artifact.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String identifiantUser;
    private String email;
    private Long number;
    private String nom;
    private String prenom;
    private String mdp;

    @Enumerated(EnumType.STRING)
    private UserType type;

    private Double notePoste;



    @OneToOne(mappedBy = "chefEquipe")
    @JoinColumn(name = "chefEq_service_id")
    @JsonBackReference("chefEq_service_id")
    private ServiceEq chefEquipeService;



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "serviceEq_id")
    @JsonBackReference("employe_reference")
    private ServiceEq serviceEq;

    @OneToMany( mappedBy = "user")
    @JsonManagedReference("evaluation_user_reference")  // Indicates that this is the parent side of the relationship
    private Set<Evaluation> evaluations;

    @ManyToMany(mappedBy = "users")
    @JsonIgnore
    private Set<Formation> formation ;

    @ManyToMany(mappedBy = "users")
    @JsonIgnore
    private Set<Notification> notifications;





    @PrePersist
    private void generateIdentifiantUser() {
        String baseIdentifiant = generateUniqueNumber();
        this.identifiantUser = nom  + "-" + generateUniqueNumber();
    }

    // Méthode pour générer un nombre unique
    private String generateUniqueNumber() {
        // Utilisez un UUID pour générer un nombre unique
        return UUID.randomUUID().toString().substring(0, 5); // Limité à 8 caractères
    }


    // Getters and setters


}

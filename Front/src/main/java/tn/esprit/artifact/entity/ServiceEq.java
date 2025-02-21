package tn.esprit.artifact.entity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ServiceEq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;

    @OneToOne
    @JoinColumn(name = "chefEq_id")
    @JsonManagedReference("chefEq_service_id")
    private User chefEquipe;

    @OneToMany(
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH},
            fetch = FetchType.EAGER,
            mappedBy = "serviceEq"
    )
    @JsonManagedReference("employe_reference")
    private Set<User> employes;
}

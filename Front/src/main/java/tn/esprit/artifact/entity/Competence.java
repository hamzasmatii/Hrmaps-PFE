package tn.esprit.artifact.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Competence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;


    @ManyToOne
    @JoinColumn(name = "job_position_id")
    @JsonBackReference("competance_poste_reference")    // Use if there's a reciprocal reference in JobPosition
    JobPosition jobPosition;

    @OneToMany( cascade = CascadeType.ALL,mappedBy = "competence")
    @JsonManagedReference("competance_evaluation_reference")    // Indicates that this is the parent side of the relationship
    private Set<Evaluation> evaluations;




}

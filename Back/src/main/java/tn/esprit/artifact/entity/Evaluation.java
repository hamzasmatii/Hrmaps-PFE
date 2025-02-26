package tn.esprit.artifact.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Date;
import java.util.Locale;

import static tn.esprit.artifact.entity.EvaluationType.FORUSER;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private EvaluationType eval;

    @ManyToOne
    @JsonBackReference("competance_evaluation_reference")  // Use if there's a reciprocal reference in JobPosition
    Competence competence;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("evaluation_user_reference")
    private User user;

    private Double  note;

    private Date dateEvalu;

    // Method to calculate the note
    public void calculNote() {
        if (eval != EvaluationType.FORUSER) {
            switch (eval) {
                case EXCELLENT:
                    this.note = formatNoteValue(5.0);
                    break;
                case SATISFAISANT:
                    this.note = formatNoteValue(2.0);
                    break;
                case INSATISFAISANT:
                    this.note = formatNoteValue(1.0);
                    break;
                default:
                    throw new IllegalArgumentException("Unknown EvaluationType: " + eval);
            }
        } else {
            this.note = null;
        }
    }

    // Method to format the note to two decimal places
    private Double formatNoteValue(Double value) {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.US);
        symbols.setDecimalSeparator('.');
        DecimalFormat df = new DecimalFormat("0.00", symbols);
        return Double.valueOf(df.format(value));
    }


}

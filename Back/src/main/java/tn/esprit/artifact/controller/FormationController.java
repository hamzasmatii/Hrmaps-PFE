package tn.esprit.artifact.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.artifact.entity.Formation;
import tn.esprit.artifact.service.IFormationService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FormationController {
    @Autowired
    IFormationService formationService;

    @PostMapping("/formation")
    public ResponseEntity<Formation> addFormation(@RequestBody Formation formation) {
        Formation addedFormation = formationService.createFormation(formation);
        return new ResponseEntity<>(addedFormation, HttpStatus.CREATED);
    }

    @GetMapping("/formation/{formationId}")
    public ResponseEntity<Formation> showFormationByid(@PathVariable Long formationId) {
        Formation formation = formationService.getFormationById(formationId);
        if (formation != null) {
            return ResponseEntity.ok(formation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/formation")
    public ResponseEntity<List<Formation>> getAllFormations() {
        List<Formation> formations = formationService.getAllFormations();
        return ResponseEntity.ok(formations);
    }

    @PutMapping("/formation/{formationId}")
    public ResponseEntity<Formation> updateFormation(@PathVariable("formationId") Long formationId, @RequestBody Formation updatedFormation) {
        try {
            Formation updated = formationService.updateFormation(formationId, updatedFormation);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/formation/{formationId}")
    public ResponseEntity<Void> deleteFormation(@PathVariable Long formationId) {
        try {
            formationService.deleteFormation(formationId);

            // Create the response message
            String message = "Formation with ID " + formationId + " deleted successfully.";

            // Create the response headers
            HttpHeaders headers = new HttpHeaders();
            headers.add("Message", message);
            // Return the response entity with the response object and status OK
            return new ResponseEntity<>(headers, HttpStatus.OK);
        }

        catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("formation/user/{userId}")
    public ResponseEntity<List<Formation>> getFormationsByUserId(@PathVariable Long userId) {
        List<Formation> formations = formationService.getFormationsByUserId(userId);
        return new ResponseEntity<>(formations, HttpStatus.OK);
    }
    
}

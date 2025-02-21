package tn.esprit.artifact.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.artifact.entity.ServiceEq;
import tn.esprit.artifact.service.IServiceEqService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ServiceEqController {
    @Autowired
    IServiceEqService serviceEqService;

    @PostMapping("/serviceEq")
    public ResponseEntity<ServiceEq> addServiceEq(@RequestBody ServiceEq serviceEq) {
        ServiceEq addedServiceEq = serviceEqService.createServiceEq(serviceEq);
        return new ResponseEntity<>(addedServiceEq, HttpStatus.CREATED);
    }

    @GetMapping("/serviceEq/{serviceEqId}")
    public ResponseEntity<ServiceEq> showServiceEqByid(@PathVariable Long serviceEqId) {
        ServiceEq serviceEq = serviceEqService.getServiceEqById(serviceEqId);
        if (serviceEq != null) {
            return ResponseEntity.ok(serviceEq);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/serviceEq")
    public ResponseEntity<List<ServiceEq>> getAllServiceEqs() {
        List<ServiceEq> serviceEqs = serviceEqService.getAllServiceEqs();
        return ResponseEntity.ok(serviceEqs);
    }

    @PutMapping("/serviceEq/{serviceEqId}")
    public ResponseEntity<ServiceEq> updateServiceEq(@PathVariable("serviceEqId") Long serviceEqId, @RequestBody ServiceEq updatedServiceEq) {
        try {
            ServiceEq updated = serviceEqService.updateServiceEq(serviceEqId, updatedServiceEq);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/serviceEq/{serviceEqId}")
    public ResponseEntity<Void> deleteServiceEq(@PathVariable Long serviceEqId) {
        try {
            ServiceEq deletedServiceEq = serviceEqService.deleteServiceEq(serviceEqId);

            // Create the response message
            String message = "ServiceEq with ID " + serviceEqId + " deleted successfully.";

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

    @GetMapping("/serviceEq/user/{userId}")
    public ServiceEq getServiceEqByUserId(@PathVariable Long userId) {
        return serviceEqService.getServiceEqByUserId(userId);
    }

    @GetMapping("/serviceEq/chef/{userId}")
    public ServiceEq getServiceEqByChefId(@PathVariable Long userId) {
        return serviceEqService.getServiceEqByChefId(userId);
    }
}

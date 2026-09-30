package com.example.DecoDulce_Api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.DecoDulce_Api.dtos.DtoCake;
import com.example.DecoDulce_Api.service.CakeService;

@RestController
@RequestMapping("/api/cakes")
@CrossOrigin
public class CakeController {

    @Autowired
    private CakeService cakeService;

    

    //Funcion utilizada para crear la torta, recibe un dto por parametro, 
    // y devuelve un dto con los datos de la torta creada
   @PostMapping("/newCake")
    public ResponseEntity<DtoCake> createCake(@RequestBody DtoCake cake) {
        DtoCake created = cakeService.createCake(cake);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    //Funcion que devuelve todas las tortas, si no hay tortas devuelve un 404, 
    // sino devuelve un 200 con la lista de tortas
    @GetMapping("/getAllCakes")
    public ResponseEntity<List<DtoCake>> getAllCakes() {
        List<DtoCake> cakes = cakeService.getAllCakes();

        if (cakes.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(cakes);
    }

    @GetMapping
    public ResponseEntity<List<DtoCake>> getCatalog() {
        return ResponseEntity.ok(cakeService.getAllCakes());
    }

    @GetMapping("/admin/page")
    public ResponseEntity<Page<DtoCake>> getAdminCatalogPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.clamp(size, 1, 50);
        PageRequest pageRequest = PageRequest.of(safePage, safeSize, Sort.by("id").descending());
        return ResponseEntity.ok(cakeService.getActiveCakes(pageRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DtoCake> getById(@PathVariable Long id) {
        return ResponseEntity.of(cakeService.findById(id));
    }
    

    //Funcion que actualiza una torta, recibe el id de la torta a actualizar y un dto con los nuevos datos,
    // si la torta no existe devuelve un 404, sino devuelve un 200 con el dto de la torta actualizada
    @PutMapping("/updateCake/{id}")
    public ResponseEntity<DtoCake> updateCake(@PathVariable Long id, @RequestBody DtoCake cake) {
        DtoCake updated = cakeService.updateCake(id, cake);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/deleteCake/{id}")
    public ResponseEntity<Void> deleteCake(@PathVariable Long id) {
        System.out.println("Intentando eliminar la torta con ID: " + id);
        boolean deleted = cakeService.deleteCake(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


}
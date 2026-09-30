package com.example.DecoDulce_Api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.DecoDulce_Api.dtos.DtoCake;
import com.example.DecoDulce_Api.exception.NoCakesException;
import com.example.DecoDulce_Api.model.Cake;
import com.example.DecoDulce_Api.repository.CakeRepository;


@Service
public class CakeService {
    
    private CakeRepository cakeRepository;

    public CakeService(CakeRepository cakeRepository) {
        this.cakeRepository = cakeRepository;
    }



    /*FUncion utilizada para crear la torta */
   public DtoCake createCake(DtoCake cake) {

    //Creo una nueva torta a partir del dto recibido por parametro, y luego la guardo en la base de datos, 
    // y devuelvo un dto con los datos de la torta creada */
    Cake newCake = new Cake();
    newCake.setNombre(cake.getNombre());
    newCake.setDescripcion(cake.getDescripcion());
    newCake.setPrecioBase(cake.getPrecioBase());
    newCake.setImagen(cake.getImagen());
    newCake.setCategoria(cake.getCategoria());
    newCake.setPorciones(cake.getPorciones());
    newCake.setActivo(true);

    Cake saved = cakeRepository.save(newCake);

    DtoCake dto = new DtoCake();
    dto.setId(saved.getId());
    dto.setNombre(saved.getNombre());
    dto.setDescripcion(saved.getDescripcion());
    dto.setPrecioBase(saved.getPrecioBase());
    dto.setImagen(saved.getImagen());
    dto.setCategoria(saved.getCategoria());
    dto.setActivo(saved.getActivo());

    return dto;
}


    /*Funcion que devuelve todas las tortas */
    public List<DtoCake> getAllCakes() throws NoCakesException {

        List<DtoCake> cakes = new java.util.ArrayList<>();

        List<Cake> cakeList = cakeRepository.findAll();


         /*En caso de ser vacio la lista de cakes, cosa que no tendria que pasar nunca
        devuelve una lista vacia */
        if (cakeList.isEmpty()) {
        throw new NoCakesException("No hay tortas");
        }


        /*Creo un dto pot cada cake creada y lo agrego a la lista de cakes*/
        for (Cake cake : cakeList) {
            DtoCake dtoCake = new DtoCake();
            dtoCake.setId(cake.getId());
            dtoCake.setNombre(cake.getNombre());
            dtoCake.setDescripcion(cake.getDescripcion());
            dtoCake.setPrecioBase(cake.getPrecioBase());
            dtoCake.setImagen(cake.getImagen());
            dtoCake.setCategoria(cake.getCategoria());
            dtoCake.setPorciones(cake.getPorciones());
            dtoCake.setActivo(cake.getActivo());
            cakes.add(dtoCake);
        }
        

       
        return cakes; 
    }


    public DtoCake updateCake(Long id, DtoCake cake) {
        // Buscar la torta por ID
        Cake existingCake = cakeRepository.findById(id).orElse(null);
        if (existingCake == null) {
            return null; // lanza una excepción 
        }

        // Actualizar los campos de la torta existente con los datos del DTO
        if (cake.getNombre() != null) {
            existingCake.setNombre(cake.getNombre());
        }
        if (cake.getDescripcion() != null) {
            existingCake.setDescripcion(cake.getDescripcion());
        }
        if (cake.getPrecioBase() != null) {
            existingCake.setPrecioBase(cake.getPrecioBase());
        }
        if (cake.getImagen() != null) {
            existingCake.setImagen(cake.getImagen());
        }
        if (cake.getCategoria() != null) {
            existingCake.setCategoria(cake.getCategoria());
        }
        if (cake.getPorciones() != null) {
            existingCake.setPorciones(cake.getPorciones());
        }
        if (cake.getActivo() != null) {
            existingCake.setActivo(cake.getActivo());
        }
       

        // Guardar la torta actualizada en la base de datos
        Cake updatedCake = cakeRepository.save(existingCake);

        // Convertir la torta actualizada a un DTO y devolverlo
        DtoCake updatedDto = new DtoCake();
        updatedDto.setId(updatedCake.getId());
        updatedDto.setNombre(updatedCake.getNombre());
        updatedDto.setDescripcion(updatedCake.getDescripcion());
        updatedDto.setPrecioBase(updatedCake.getPrecioBase());
        updatedDto.setImagen(updatedCake.getImagen());
        updatedDto.setCategoria(updatedCake.getCategoria());
        updatedDto.setPorciones(updatedCake.getPorciones());
        updatedDto.setActivo(updatedCake.getActivo());

        return updatedDto;
    }



    public boolean deleteCake(Long id) {
        // Verificar si la torta existe
        if (!cakeRepository.existsById(id)) {
            return false; // O lanzar una excepción personalizada
        }

        // Eliminar la torta por ID
        cakeRepository.deleteById(id);
        return true;
    }

    public Optional<DtoCake> findById(Long id) {
        return cakeRepository.findById(id).map(this::toDto);
    }

    public Page<DtoCake> getActiveCakes(Pageable pageable) {
        return cakeRepository.findAll(pageable).map(this::toDto);
    }

    private DtoCake toDto(Cake cake) {
        DtoCake dto = new DtoCake();
        dto.setId(cake.getId());
        dto.setNombre(cake.getNombre());
        dto.setDescripcion(cake.getDescripcion());
        dto.setPrecioBase(cake.getPrecioBase());
        dto.setImagen(cake.getImagen());
        dto.setCategoria(cake.getCategoria());
        dto.setPorciones(cake.getPorciones());
        dto.setActivo(cake.getActivo());
        return dto;
    }


    /*id
nombre
descripcion
precio_base
imagen
categoria
activo */

}

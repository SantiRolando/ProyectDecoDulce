package com.example.DecoDulce_Api.repository;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.DecoDulce_Api.model.CustomerOrder;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
	@EntityGraph(attributePaths = "items")
	List<CustomerOrder> findAllByOrderByCreatedAtDesc();
}
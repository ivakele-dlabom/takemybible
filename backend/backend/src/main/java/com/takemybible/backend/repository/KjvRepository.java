package com.takemybible.backend.repository;

import com.takemybible.backend.entity.kjv.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KjvRepository extends JpaRepository<Book, Long> {

    List<Book> findAllByOrderByIdAsc();
}

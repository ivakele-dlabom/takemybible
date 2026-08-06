package com.takemybible.backend.repository;

import com.takemybible.backend.entity.BibleBook;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BibleBookRepository extends JpaRepository<BibleBook, Long> {

    List<BibleBook> findAllByOrderByPositionAsc();
}

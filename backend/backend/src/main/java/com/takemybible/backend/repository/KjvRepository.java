package com.takemybible.backend.repository;

import com.takemybible.backend.entity.kjv.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KjvRepository extends JpaRepository<Book, Integer> {

    List<Book> findAllByOrderByIdAsc();

    @Query(value = "SELECT COUNT(DISTINCT chapter) FROM kjv_verses WHERE book_id = :bookId", nativeQuery = true)
    long countDistinctChaptersByBookIdNative(@Param("bookId") Integer bookId);
}

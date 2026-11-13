package com.takemybible.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Data
@Table(name = "cross_reference_extras")
public class CrossReferenceExtras {

    @Id
    @Column(name = "cross_reference_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "cross_reference_id")
    private CrossReference crossReference;

    @Column(name = "connection_type")
    private String connectionType;

    @Column(name = "confidence")
    private  Confidence confidence ;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "theme_tags", columnDefinition = "json")
    String[] themeTags;
}

// CustomHeader.tsx (CÓDIGO FINAL VERIFICADO)

import React, { useRef, useState, useMemo } from 'react';
import { IHeaderParams } from 'ag-grid-community';

interface CustomHeaderProps extends IHeaderParams {}

export default (props: CustomHeaderProps) => {
    
    const [filterActive, setFilterActive] = useState(false);
    const filterButtonRef = useRef(null);

    const colDef = props.column.getColDef();
    
    const isFilterEnabled = !!colDef.filter; 
    const currentSort = props.column.getSort(); 

    useMemo(() => {
        setFilterActive(props.column.isFilterActive());
    }, [props.column]);


    const onHeaderClick = (event: React.MouseEvent) => {
        if (props.enableSorting) {
            props.progressSort(event.shiftKey); 
        }
    };
    
    const onFilterButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation(); 
        props.showColumnMenu(filterButtonRef.current!); 
    };

    return (
        <div 
            className="custom-header-container"
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textTransform: 'uppercase',
                justifyContent: 'left', // CENTRADO
                height: '100%',
                width: '100%',
                cursor: props.enableSorting ? 'pointer' : 'default',
                opacity: 1 
            }}
            onClick={onHeaderClick} 
        >
            
            {/* 1. Texto del Encabezado */}
            <span 
                className="ag-header-cell-text" 
                style={{ 
                    textAlign: 'center', 
                }}
            >
                {props.displayName}
            </span>

            {/* 2. Botón de FILTRO/MENÚ PERMANENTE (Solo si isFilterEnabled es true) */}
            {isFilterEnabled && ( 
                <span 
                    className="ag-header-icon ag-header-cell-menu-button" 
                    onClick={onFilterButtonClick}
                    ref={filterButtonRef} 
                    style={{ 
                        marginLeft: '8px', 
                        cursor: 'pointer',
                        opacity: 1 
                    }}
                >
                    <span className="ag-icon ag-icon-filter"></span> 
                </span>
            )}
            
            {/* 3. Icono de ORDENACIÓN (Solo se renderiza si props.enableSorting es true) */}
            {props.enableSorting && (
                <span className="ag-sort-indicator-container" style={{ marginLeft: '4px' }}>
                    
                    {/* A) Icono ASCENDENTE (si está activo) */}
                    {currentSort === 'asc' && (
                        <span className="ag-header-icon ag-sort-ascending-icon">
                            <span className="ag-icon ag-icon-asc"></span>
                        </span>
                    )}
                    
                    {/* B) Icono DESCENDENTE (si está activo) */}
                    {currentSort === 'desc' && (
                        <span className="ag-header-icon ag-sort-descending-icon">
                            <span className="ag-icon ag-icon-desc"></span>
                        </span>
                    )}
                    
                    {/* C) Icono NEUTRO (si no está ordenado, pero es ordenable) */}
                    {(!currentSort) && (
                        <span 
                            className="ag-header-icon ag-sort-none-icon"
                            style={{ opacity: 1 }} 
                        >
                            <span className="ag-icon ag-icon-none"></span>
                        </span>
                    )}
                </span>
            )}
        </div>
    );
};
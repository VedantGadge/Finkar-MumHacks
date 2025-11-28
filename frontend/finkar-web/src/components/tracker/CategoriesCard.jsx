import React from 'react';
import { motion } from 'framer-motion';

const CategoriesCard = ({ categories, onEdit }) => {
    return (
        <div className="module-list">
            {categories.map((c, i) => (
                <motion.div key={c.id} className="module-item category-item"
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onClick={() => onEdit(c)} style={{ cursor: 'pointer' }}>
                    <div className="category-swatch" style={{ background: c.color }}></div>
                    <span className="module-title">{c.name}</span>
                    <span className={`category-type ${c.type}`}>{c.type}</span>
                </motion.div>
            ))}
        </div>
    );
};

export default CategoriesCard;

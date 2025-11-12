import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface IngredientUsedBannerProps {
  isVisible: boolean;
  onHide?: () => void;
}

export default function IngredientUsedBanner({
  isVisible,
  onHide,
}: IngredientUsedBannerProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  const handleClick = () => {
    onHide?.();
    navigate('/refrigerator');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ingredient-used-banner"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-[92%] max-w-[430px] bg-[#F0F0F0] rounded-[10px] shadow-md py-3 px-4 flex justify-between items-center text-[14.4px] font-[Pretendard] text-[#3B3B3B] z-[60] mb-14"
        >
          <span>재료가 차감되었어요!</span>
          <button
            onClick={handleClick}
            className="flex items-center gap-1 text-[#FF8800] hover:underline"
          >
            <span>냉장고로</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

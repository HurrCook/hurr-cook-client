/* eslint-disable react/prop-types */
import Button from '@/components/common/Button';
import SubtractCard from '@/pages/recipe/components/SubtractCard';

interface InventoryItem {
  id: number;
  name: string;
  image: string;
  quantity: string;
  expiryDate: string;
}

interface SubtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onConfirmSubtract: (recipeId: number) => void;
  recipe: {
    id: number;
    name: string;
    ingredients: { name: string; quantity: string }[];
  };
}

const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 101,
    name: '피망',
    image: 'https://placehold.co/40x40/73C05D/FFFFFF?text=P',
    quantity: '10개',
    expiryDate: '2025.08.30',
  },
  {
    id: 102,
    name: '양파',
    image: 'https://placehold.co/40x40/E8D293/000000?text=O',
    quantity: '4개',
    expiryDate: '2025.09.30',
  },
  {
    id: 103,
    name: '간장',
    image: 'https://placehold.co/40x40/333333/FFFFFF?text=S',
    quantity: '1병',
    expiryDate: '2026.01.01',
  },
];

const SubtractModal: React.FC<SubtractModalProps> = ({
  isOpen,
  onClose,
  onBack,
  recipe,
  onConfirmSubtract,
}) => {
  if (!isOpen) return null;

  const itemsToSubtract = MOCK_INVENTORY_ITEMS.filter((item) =>
    recipe.ingredients.some((ing) => ing.name === item.name),
  );

  const handleConfirm = () => {
    onConfirmSubtract(recipe.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
      <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-neutral-800 text-xl font-normal">재료 차감</h2>
        </div>

        <div className="p-6 pt-0 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-[10px]">
            {itemsToSubtract.length > 0 ? (
              itemsToSubtract.map((item) => (
                <SubtractCard key={item.id} item={item} />
              ))
            ) : (
              <p className="text-center text-neutral-500 py-10">
                차감할 재료가 냉장고에 없습니다.
              </p>
            )}
          </div>
        </div>

        <div className="p-4 flex justify-between gap-3">
          <Button color="cancel" onClick={onBack}>
            이전
          </Button>
          <Button color="default" onClick={handleConfirm}>
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubtractModal;

import React from 'react';
import Button from '@/components/Button';
import FooterButton from '@/components/FooterButton';

export default function RecipePage() {
  return (
    <>
      <Button color="cancel">취소</Button>
      <Button color="default">요리하기</Button>
      <Button color="default">다음</Button>
      <FooterButton>다음으로</FooterButton>
    </>
  );
}

// export default function RecipePage() {
//   return (
//     <div className="w-full py-12 bg-white inline-flex justify-between items-start overflow-hidden">
//       <div className="inline-flex flex-col justify-start items-center gap-5">
//         <FooterButton color="default">다음</FooterButton>
//       </div>
//     </div>
//   );
// }

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

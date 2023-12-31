'use client';
// eslint-disable-next-line import/no-unresolved
import { useState, useRef, useCallback, RefObject, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { CheckBoxIcon } from '@components/atoms/IconButton';
import Text from '@components/atoms/Text';
import Flex from '@components/layout/Flex';

export interface ICheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // 표시할 라벨 => 옵셔널하게...
  checkLabel?: string;
  unCheckLabel?: string;
  ref?: RefObject<HTMLInputElement>; // 리액트 컴포넌트에서 dom접근을 위해서 사용함.
}

// 커스텀한 체크박스를 표시하므로 display none
const CheckboxElement = styled.input<ICheckboxProps>`
  display: none;
`;

const Label = styled.label`
  cursor: pointer;
  margin-left: 0px;
  user-select: none;
`;

const Checkbox = (props: ICheckboxProps) => {
  // props내용들...
  const { id, onChange, checked, checkLabel, unCheckLabel, ...rest } = props;
  // 체크 상태 관리 위한 useState
  const [isChecked, setChecked] = useState(checked);
  const label = useRef<string | undefined>(isChecked ? checkLabel : unCheckLabel);
  // dom접근을 위한 useRef => useRef는 null로 초기화
  const ref = useRef<HTMLInputElement>(null);

  // useCallback을 통해 의존 배열내 내용이 변경되지 않으면 메모이제이션된 콜백함수를 사용한다.
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setChecked(isChecked => {
        label.current = isChecked ? unCheckLabel : checkLabel;
        return !isChecked;
      }); // 리액트 훅에는 콜백함수를 통해 이전값을 새로운 값으로 처리가능.
    },
    [setChecked, unCheckLabel, checkLabel],
  );

  // 화면에 페인팅 되기 전 실행하는 훅
  useLayoutEffect(() => {
    setChecked(checked ?? false);
  }, [checked]);

  return (
    <Flex alignitems="center">
      <CheckboxElement
        {...rest}
        ref={ref}
        type="checkbox"
        defaultChecked={checked}
        onChange={onChange}
      ></CheckboxElement>
      <CheckBoxIcon size={20} onClick={handleClick} checked={isChecked} />
      <Label htmlFor={id} onClick={handleClick}>
        <Text>{label.current}</Text>
      </Label>
    </Flex>
  );
};

export default Checkbox;

import styled from 'styled-components';

const PriceTag = styled.span`
  background: ${props => props.theme.red};
  transform: rotate(3deg);
  color: white;
  font-weight: 300;
  padding: 5px;
  line-height: 1;
  font-size: 24px;
  display: inline-block;
  position: absolute;
  top: -3px;
  right: -3px;
`;

export default PriceTag;

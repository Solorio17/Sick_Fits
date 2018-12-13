import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const AnimationStyles = styled.span`
    position: relative;
    .count{
        display: block;
        position: relative;
        transition: all 0.5s;
        backface-visibility: hidden
    }
    .count-enter-done{
        transform: rotateX(0.5turn);
    }
    .count-enter-active{
        transform: rotateX(0)
    }
    .count-exit-done{
        top: 0;
        position: absolute;
        transform: rotateX(0)
    }
    .count-exit-active{
        transform: rotateX(0.5turn);
    }
`;

const CountDot = styled.div`
    background: ${props => props.theme.red};
    color: white;
    border-radius: 100%;
    line-height: 22px;
    min-width: 3rem;
    padding: 6px;
    margin-left: 1rem;
    font-weight: 100;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
`;

const CartCount = ({ count }) => (
    <AnimationStyles>
        <TransitionGroup>
            <CSSTransition
                unmountOnExit
                className="count"
                classNames="count"
                key={count}
                timeout={{ enter: 500, exit: 500}}
            >
                <CountDot>{count}</CountDot>
            </CSSTransition>
        </TransitionGroup>
    </AnimationStyles>
)

export default CartCount;
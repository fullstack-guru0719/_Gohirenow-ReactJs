import React, { Component } from 'react';

export default class OutsideClick extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { active } = this.props;
        const { active: prevActive } = prevProps;
        if (active && !prevActive) {
            document.addEventListener('mousedown', this.handleClickOutside);
            document.addEventListener('touchstart', this.handleClickOutside);
        } else if (!active && prevActive) {
            document.removeEventListener('mousedown', this.handleClickOutside);
            document.removeEventListener('touchstart', this.handleClickOutside);

        }
    }

    handleClickOutside(event) {
        const { props: {callBack, active} } = this;
        if (active && this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            callBack(event);
        }
    }

    render() {
        return <div ref={this.setWrapperRef}>{this.props.children}</div>;
    }
}

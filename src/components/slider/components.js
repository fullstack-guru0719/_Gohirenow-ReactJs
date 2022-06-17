import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

const railOuterStyle = {
    position: 'absolute',
    transform: 'translate(0%, -50%)',
    width: '100%',
    height: 42,
    borderRadius: 7,
    cursor: 'pointer',
};

const railInnerStyle = {
    position: 'absolute',
    width: '100%',
    height: 7,
    transform: 'translate(0%, -50%)',
    borderRadius: 7,
    pointerEvents: 'none',
    backgroundColor: "rgb(225,225,225)",
    cursor: 'pointer',
};

export function SliderRail({ getRailProps }) {
    return (
        <Fragment>
            <div style={railOuterStyle} {...getRailProps()} />
            <div style={railInnerStyle} />
        </Fragment>
    )
}

SliderRail.propTypes = {
    getRailProps: PropTypes.func.isRequired,
};

export class Handle extends Component {
    state = {
        mouseOver: false,
    };

    onMouseEnter = () => {
        this.setState({ mouseOver: true })
    };

    onMouseLeave = () => {
        this.setState({ mouseOver: false })
    };

    render() {
        const {
            domain: [min, max],
            handle: { id, value, percent },
            isActive,
            disabled,
            getHandleProps,
        } = this.props;
        const { mouseOver } = this.state;
        return (
            <Fragment>
                {(mouseOver || isActive) && !disabled ? (
                    <div
                        style={{
                            left: `${percent}%`,
                            position: 'absolute',
                            marginTop: '-35px',
                            cursor: 'pointer',
                        }}
                    >
                        <div className="tooltip">
                            <span className="tooltiptext">Value: {value}</span>
                        </div>
                    </div>
                ) : null}
                <div
                    style={{
                        left: `${percent}%`,
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)',
                        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                        zIndex: 400,
                        width: 14,
                        height: 14,
                        cursor: 'pointer',
                        backgroundColor: 'none',
                        marginLeft: id === "$$-0" ? '7px' : '-7px',
                    }}
                    {...getHandleProps(id, {
                        onMouseEnter: this.onMouseEnter,
                        onMouseLeave: this.onMouseLeave,
                    })}
                />
                <div
                    role="slider"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={value}
                    style={{
                        left: `${percent}%`,
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)',
                        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                        zIndex: 300,
                        width: 14,
                        height: 14,
                        border: 0,
                        borderRadius: '50%',
                        boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)',
                        backgroundColor: "#00aff0",
                        marginLeft: id === "$$-0" ? '7px' : '-7px',
                    }}
                />
            </Fragment>
        )
    }
}

Handle.propTypes = {
    domain: PropTypes.array.isRequired,
    handle: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired,
    }).isRequired,
    getHandleProps: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
};

Handle.defaultProps = {
    disabled: false,
};
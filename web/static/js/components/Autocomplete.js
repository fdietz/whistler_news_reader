import React, { PropTypes, Component } from "react";
import classNames from "classnames";

import DropdownContent from "./DropdownContent";

class Autocomplete extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    style: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      value: "",
      isOpen: false,
      selectedIndex: null
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleKeyDown(event) {
    const { selectedIndex } = this.state;
    const { items }         = this.props;

    if (event.keyCode === 13) {
      const item = items[selectedIndex];
      if (item) {
        this.setState({ value: item.title, isOpen: false, selectedIndex: -1 });
        this.props.onSelect(item);
      }
      event.preventDefault();
    } else if (event.keyCode === 40) {
      if (selectedIndex+1 < items.length) {
        this.setState({ selectedIndex: selectedIndex+1 });
      } else if (!selectedIndex) {
        this.setState({ selectedIndex: 0 });
      }
      event.preventDefault();
    } else if (event.keyCode === 38) {
      if (selectedIndex-1 >= 0) {
        this.setState({ selectedIndex: selectedIndex-1 });
      }
      event.preventDefault();
    }
  }

  handleChange(event) {
    const { items } = this.props;
    const value = this.refs.input.value;
    this.setState({ value: value, isOpen: value.length > 2 && items.length > 0 });

    this.props.onChange(value);
  }

  handleOnClick(item, event) {
    this.setState({ value: item.title, isOpen: false, selectedIndex: -1 });
    this.props.onSelect(item);
  }

  render () {
    const { placeholder, items } = this.props;
    const { className, inputClassName, style } = this.props;
    const { selectedIndex } = this.state;

    const cls = classNames("autocomplete", className);
    const inputCls = classNames(inputClassName);

    return (
      <div className={cls} style={style}>
        <input
          type="text"
          ref="input"
          className={inputCls}
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          placeholder={placeholder}/>

        <DropdownContent active={this.state.isOpen} style={{ width: "100%"}}>
          <ol className="dropdown__list">
            {items.slice(0, 5).map((item, index) => {
              const listItemCls = classNames("dropdown__list-item prominent", {
                active: index === selectedIndex
              });

              return (
                <li
                  className={listItemCls}
                  onClick={this.handleOnClick.bind(this, item)}
                  key={item.id}>
                  {item.title}
                </li>
              );
            })}
          </ol>
        </DropdownContent>
      </div>
    );
  }
}

export default Autocomplete;

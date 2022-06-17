import React from "react";

import _ from "lodash";

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pager: {} };
  }

  componentWillMount() {
    if (this.props.countItems) {
      this.setPage(this.props.forcedPage || this.props.initialPage, true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.countItems !== prevProps.countItems) {
      //   this.setPage(this.props.initialPage);
      this.setPage(this.props.initialPage, true);
    }
    if (
      this.props.forcedPage &&
      this.props.forcedPage !== prevProps.forcedPage &&
      this.props.forcedPage !== this.state.pager.currentPage
    ) {
      this.setPage(this.props.forcedPage);
    }
  }

  setPage(page, isFirst) {
    let countItems = this.props.countItems;
    let pager = this.state.pager;
    let pageSize = parseInt(this.props.pageSize);
    if (page < 1 || page > pager.totalPages) {
      return;
    }
    pager = this.getPager(countItems, page, pageSize);
    this.setState({ pager: pager });

    !isFirst &&
      this.props.onChangePage(
        pager.startIndex,
        pager.endIndex + 1,
        pager.currentPage
      );
  }
  getPager(totalItems, currentPage, pageSize) {
    currentPage = currentPage || 1;
    pageSize = pageSize || 10;
    let totalPages = Math.ceil(totalItems / pageSize);
    let startPage, endPage;
    if (totalPages <= 10) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    let pages = _.range(startPage, endPage + 1);
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }

  render() {
    let pager = this.state.pager;
    if (!pager.pages || pager.pages.length <= 1) {
      return null;
    }

    return (
      <ul className="paginations">
        {/*   <li className={pager.currentPage === 1 ? 'disabled' : null} onClick={() => this.setPage(1)}>
                    <a title="First" className="text-uppercase clickable" >
                        First
                    </a>
                </li>  */}
        <li
          className={pager.currentPage === 1 ? "disabled" : null}
          onClick={() => this.setPage(pager.currentPage - 1)}
        >
          <a title="Previous" className="text-uppercase clickable">
            Prev
          </a>
        </li>
        {pager.pages.map((page, index) => (
          <li
            className={pager.currentPage === page ? "active" : null}
            name={page}
            key={index}
            onClick={() => this.setPage(page)}
          >
            <a className="text-uppercase clickable">{page}</a>
          </li>
        ))}
        <li
          className={pager.currentPage === pager.totalPages ? "disabled" : null}
          onClick={() => this.setPage(pager.currentPage + 1)}
        >
          <a title="Next" className="text-uppercase clickable">
            Next
          </a>
        </li>
        {/*      <li className={pager.currentPage === pager.totalPages ? 'disabled' : null} onClick={() => this.setPage(pager.totalPages)}>
                    <a title="Last" className="text-uppercase clickable">
                        Last
                    </a>
                </li>
                */}
      </ul>
    );
  }
}

export default Pagination;

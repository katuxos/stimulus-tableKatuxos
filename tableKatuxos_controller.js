import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

/* 
TABLEKATUXOS CONTROLLER — DOCUMENTATION
--------------------------------

    1. Usage:
        Attach the controller to any <table> element:
            data-controller="tableKatuxos"

    2. Optional configuration (all attributes are optional):
        data-tableKatuxos-order="true|false"
            Enables or disables column sorting.
            Default: true

        data-tableKatuxos-search="true|false"
            Enables or disables the search box.
            Default: true

        data-tableKatuxos-pagination="true|false"
            Enables or disables pagination and rows-per-page selector.
            Default: true

        data-tableKatuxos-maxperpage="number"
            Sets the initial number of rows per page.
            Default: 10

    3. Table structure requirements:
        The target table must be properly structured so that all optional
        features (sorting, search, pagination) can operate safely:

            <table>
                <thead>
                    <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        ...
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Value</td>
                        <td>Value</td>
                        ...
                    </tr>
                </tbody>
            </table>

    4. If you have other stimulus controllers that manipulate data in table:
        At the end of your filtering tasks in the controller, add this line
        so table is refreshed:
            document.dispatchEvent(new CustomEvent("tableKatuxos:refresh"));

    5.  Notes:
        - The controller automatically injects a header (search + rows-per-page)
            and a footer (pagination controls) around the table, if options are configured as true.
        - Each table remains unique, no collisions even inside turbo-frames.
*/

    connect() {
        // Optional parameters
        this.enableOrder = this.element.dataset.tableKatuxosOrder !== "false";
        this.enableSearch = this.element.dataset.tableKatuxosSearch !== "false";
        this.enablePagination = this.element.dataset.tableKatuxosPagination !== "false";
        this.rowsPerPage = parseInt(this.element.dataset.tableKatuxosMaxperpage || "10");

        // State
        this.tbody = this.element.querySelector("tbody");
        this.rows = Array.from(this.tbody.querySelectorAll("tr"));
        this.currentPage = 1;
        this.currentSearch = "";
        this.currentSort = { index: null, direction: 1 };

        // User interface
        if (this.enableSearch || this.enablePagination) {
            this.injectHeader();
        }
        if (this.enablePagination) {
            this.injectFooter();
        }

        // Sort
        if (this.enableOrder) {
            this.setupHeaders();
        }

        //Refresh event
        document.addEventListener("tableKatuxos:refresh", () => { 
            this.rows = Array.from(this.tbody.querySelectorAll("tr")); 
            this.currentPage = 1; 
            this.render(); 
        });

        this.render();
    }

    // ---------------------------
    // Header
    // ---------------------------
    injectHeader() {
        const wrapper = document.createElement("div");
        wrapper.classList.add("flex", "items-center", "justify-between", "mb-2");

        // Search
        if (this.enableSearch) {
            const search = document.createElement("input");
            search.type = "text";
            search.placeholder = "Buscar...";
            search.classList.add("p-2", "rounded", "bg-gray-100");
            search.addEventListener("input", (e) => this.buscar(e));
            wrapper.appendChild(search);
        }

        // Rows per page 
        if (this.enablePagination) {
            const select = document.createElement("select");
            select.classList.add("p-1", "rounded", "bg-gray-100");
            select.innerHTML = `
                <option value="10" ${this.rowsPerPage === 10 ? "selected" : ""}>10</option>
                <option value="20" ${this.rowsPerPage === 20 ? "selected" : ""}>20</option>
                <option value="50" ${this.rowsPerPage === 50 ? "selected" : ""}>50</option>
            `;
            select.addEventListener("change", (e) => this.cambiarFilas(e));
            wrapper.appendChild(select);
        }

        this.element.parentNode.insertBefore(wrapper, this.element);
    }

    // ---------------------------
    // FOOTER 
    // ---------------------------
    injectFooter() {
        const footer = document.createElement("div");
        footer.classList.add("flex", "items-center", "justify-center", "gap-4", "mt-2");

        // Previous
        const prev = document.createElement("button");
        prev.innerText = "<<";
        prev.classList.add("w-8", "h-8", "flex", "items-center", "justify-center", "rounded-full", "bg-black", "text-white", "text-sm",  "hover:bg-gray-800",  "transition");
        prev.addEventListener("click", () => this.prevPage());

        // Current Page
        this.pageInfo = document.createElement("span");
        this.pageInfo.classList.add("text-sm", "text-gray-400");

        // Next
        const next = document.createElement("button");
        next.innerText = ">>";
        next.classList.add("w-8", "h-8", "flex", "items-center", "justify-center", "rounded-full", "bg-black", "text-white", "text-sm",  "hover:bg-gray-800",  "transition");
        next.addEventListener("click", () => this.nextPage());

        footer.appendChild(prev);
        footer.appendChild(this.pageInfo);
        footer.appendChild(next);

        this.element.parentNode.insertBefore(footer, this.element.nextSibling);
    }

    // ---------------------------
    // SORT
    // ---------------------------
    setupHeaders() {
        const headers = this.element.querySelectorAll("th");
        headers.forEach((th, index) => {
            th.style.cursor = "pointer"
            th.addEventListener("click", () => this.sortByColumn(index))
        });
    }

    sortByColumn(index) {
        if (!this.enableOrder) return;

        if (this.currentSort.index === index) {
            this.currentSort.direction *= -1;
        } else {
            this.currentSort = { index, direction: 1 };
        }

        this.rows.sort((a, b) => {
            const A = a.children[index].innerText.trim();
            const B = b.children[index].innerText.trim();
            return A.localeCompare(B, "es", { numeric: true }) * this.currentSort.direction;
        })

        this.render();
        
    }

    // ---------------------------
    // SEARCH
    // ---------------------------
    buscar(event) {
        if (!this.enableSearch) return;

        this.currentSearch = event.target.value.toLowerCase();
        this.currentPage = 1;
        this.render();
    }

    filterRows() {
        if (!this.enableSearch || !this.currentSearch) return this.rows;

        return this.rows.filter(row =>
            row.innerText.toLowerCase().includes(this.currentSearch)
        );
    }

    // ---------------------------
    // PAGINATION
    // ---------------------------
    cambiarFilas(event) {
        if (!this.enablePagination) return;

        this.rowsPerPage = parseInt(event.target.value);
        this.currentPage = 1;
        this.render();
    }

    nextPage() {
        if (!this.enablePagination) return;

        this.currentPage++;
        this.render();
    }

    prevPage() {
        if (!this.enablePagination) return;

        if (this.currentPage > 1) {
            this.currentPage--;
            this.render();
        }
    }

    paginate(filtered) {
        if (!this.enablePagination) return filtered;

        const start = (this.currentPage - 1) * this.rowsPerPage;
        return filtered.slice(start, start + this.rowsPerPage);
    }

    // ---------------------------
    // RENDER
    // ---------------------------
    render() {
        const filtered = this.filterRows();
        const paginated = this.paginate(filtered);

        this.tbody.innerHTML = "";
        paginated.forEach(row => this.tbody.appendChild(row));

        if (this.enablePagination) {
            const totalPages = Math.ceil(filtered.length / this.rowsPerPage);
            this.pageInfo.innerText = `Página ${this.currentPage} de ${totalPages}`;
        }
    }
}

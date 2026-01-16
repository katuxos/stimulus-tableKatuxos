# stimulus-tableKatuxos  
### A lightweight Stimulus controller for sortable, searchable, paginated tables

**tableKatuxos** is a minimal, dependency‑free Stimulus controller that enhances any HTML table with:

- Column sorting  
- Live search  
- Pagination with rows‑per‑page selector  

It works seamlessly with **Symfony**, **Turbo**, **Importmap**, **Tailwind**, and any Stimulus setup.

No jQuery.  
No DataTables.  
No CSS required.  
Just Stimulus.

---

## Features

- Sorting by clicking on column headers  
- Real‑time search  
- Pagination with configurable rows per page  
- Declarative configuration via `data-*` attributes  
- Fully compatible with Turbo Frames and Turbo Streams  
- Supports external filters via a simple event  
- Zero dependencies  
- Lightweight and portable  

---

## Installation

Place the controller in your Stimulus controllers directory:

  **assets/controllers/tableKatuxos_controller.js**

---

## Usage

```html
<table data-controller="tableKatuxos">
  <thead>
      <tr>
          <th>Name</th>
          <th>City</th>
      </tr>
  </thead>
  <tbody>
      <tr><td>Ana</td><td>Pontevedra</td></tr>
      <tr><td>Marcos</td><td>Vigo</td></tr>
  </tbody>
</table>
```
---

## Optional Parameters

```html
<table
    data-controller="tableKatuxos"
    data-tableKatuxos-order="true"
    data-tableKatuxos-search="true"
    data-tableKatuxos-pagination="true"
    data-tableKatuxos-maxperpage="20"
>
```
---

## External filters

If another Stimulus controller modifies the table rows, trigger a refresh:

```js
document.dispatchEvent(new CustomEvent("tableKatuxos:refresh"))
```

--- 
## Quick access 
You can also grab the controller directly from this Gist: 

 **https://gist.github.com/katuxos/f5fc75df581472d3755e638e36d1f67a**

---

## License

MIT — free to use, modify, and share.

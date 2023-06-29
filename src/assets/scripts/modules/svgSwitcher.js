 import useState from "./hooks/useState";


export default function svgSwitcher() {
    const [ view, setView, useViewEffect ] = useState(History.getSearchUrl(window.location.href).view || '');

    const history = new History({
      updateFsm: (l) => {
        console.log(l);
        // setView(l.view);
      }
    })

    useViewEffect(currentView => {
        document.querySelectorAll('[data-page]').forEach(el => {
            

            if (el.dataset.page === 'default' && !currentView) {
                el.style.display = '';
                return;
            }
            if (el.dataset.page === currentView) {
                el.style.display = '';
                return;
            }
            el.style.display = 'none';
        });

        history.next({
            view: currentView
        })
    });

    setView(view());
    document.body.addEventListener('dblclick',function(evt){
        const target = evt.target.closest('[data-dblclick-link]');
        if (!target) return;

        setView(target.dataset.dblclickLink);
    });
    document.body.addEventListener('click',function(evt){
        const target = evt.target.closest('[data-link]');
        if (!target) return;

        setView(target.dataset.link);
    });
}


class History {
    constructor(data) {
      this.history = [];
      this.updateFsm = data.updateFsm;
      this.update = this.update.bind(this);
      this.next = this.next.bind(this);
      this.parseSearchUrl = this.parseSearchUrl.bind(this);
      this.replaceUrl = this.replaceUrl.bind(this);
      this.stepBack = this.stepBack.bind(this);
      this.init();
    }
  
    init() {
      const initialSearchParams = this.parseSearchUrl(window.location.href);
      if (initialSearchParams.buildtype) {
        localStorage.setItem('filter_buildtype', initialSearchParams.buildtype);
      }
      window.onpopstate = e => {
        this.stepBack(e.state);
        return true;
      };
    }
  
    stepBack(data) {
      const config = data ? data : this.history;
      this.updateFsm(config, false);
    }
  
    next(name) {
      window.history.pushState(
        name, '3dModule', this.createUrl(name),
      );
      this.history = name;
    }
  
    update(search) {
      const searchConfig = this.parseSearchUrl(window.location);
      const newSearch = {
        ...searchConfig,
        ...search,
      };
  
      window.history.replaceState(
        newSearch, '3dModule', this.createUrl(newSearch),
      );
      this.history = newSearch;
    }
  
    replaceUrl(name) {
      window.history.replaceState(
        name, '3dModule', this.createUrl(name),
      );
    }
  
    createUrl(data) {
      const entries = Object.entries(data);
      const href = entries.reduce((acc, [key, value]) => `${acc}&${key}=${value}`, '');
      // return `?${encodeURIComponent(href)}`;
      return `?${href}`;
    }
  
    parseSearchUrl(url) {
      const { searchParams } = new URL(decodeURIComponent(url));
      const parseSearchParam = Object.fromEntries(searchParams.entries());
      return parseSearchParam;
    }

    static getSearchUrl(url) {
      const { searchParams } = new URL(decodeURIComponent(url));
      const parseSearchParam = Object.fromEntries(searchParams.entries());
      return parseSearchParam;
    }
  }
export default function useState(initialValue) {
    let value = typeof initialValue === 'function' ? initialValue() : initialValue;
    const subscribers = [];
  
    function setValue(newValue) {
      value = newValue;
      subscribers.forEach((subscriber) => subscriber(value));
    }
  
    function getState() {
      return value;
    }
  
    function subscribe(callback) {
      subscribers.push(callback);
      return () => {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      };
    }
  
    return [getState, setValue, subscribe];
}
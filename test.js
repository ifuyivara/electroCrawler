
function LinkedList(){
  // basic properties
  this.head = null;
  this.tail = null;
  this.length = 0;
}

/*
 * Create a linked list prototype
 */
LinkedList.prototype = {

  // add a node
  add: function (data){
    var node = {
      data: data,
      next: null,
      prev: null
    };
    // if there are no items in the list then
    // this node is both the head and tail
    if (this.length === 0) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    // update the lenght of the list
    this.length++;
  },

  // find item
  item: function(index){
    if (index > -1 && index < this.length){
      current = this.head;
      i = 0;
      while(i++ < index){
        current = current.next;
      }

      return current.data;
    } else {
      return null;
    }
  },

  // remove a node
  remove: function(index){
    //check for out-of-bounds values
    if (index > -1 && index < this.length){

      var current = this.head,
      i = 0;

      //special case: removing first item
      if (index === 0){
        this.head = current.next;
        if (!this.head){
          this.tail = null;
        } else {
          this.head.prev = null;
        }

      //special case: removing last item
      } else if (index === this.length -1){
        current = this.tail;
        this.tail = current.prev;
        this.tail.next = null;
      } else {
        //find the right location
        while(i++ < index){
          current = current.next;
        }
        // just remove the pointers
        current.prev.next = current.next;
        current.next.prev =  current.prev;
      }

      //decrement the length
      this.length--;

      //return the value
      return current.data;

    } else {
      return null;
    }
  },

};


// test this:
var linked = new LinkedList()
linked.add("data");
linked.add("data dos");
linked.add("data tres");
linked.remove(1);
console.log(linked.length);
console.log(linked.item(1));

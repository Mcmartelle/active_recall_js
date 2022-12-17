// ====start Data====
var root = document.body;
var synth = window.speechSynthesis;

if (typeof synth === 'undefined') {
  alert('Speech Synthesis is not supported on this browser. See https://caniuse.com/?search=Speech%20Synthesis for browser support.')
}

var voices = [];
var voice = {}
var prevVoiceLength = 0;
var voiceTestString = "Hello there.";

var deck = {}; // deck obj for edit page
var deckIndex = 0;

var g = { // g means Game
  question: "",
  answer: "",
  answerAttempt: "",
  answerSubmitted: false,
  feedback: "",
  qaPairs: [],
  qaPair: {},
  qaPairIndex: 0,
  inProgress: false,
  correctCount: 0,
  incorrectCount: 0
}
var d = [ // d means Decks
  {
    name: 'What is active recall?',
    cards: [
      {
        q: "Learning something by just reading it over and over.",
        a: "passive review"
      },
      {
        q: "When you try to think of the answer on the back of a flashcard without looking first",
        a: "active recall"
      },
      {
        q: "This is a local first app. Your decks are saved to 'blank' in your browser and not sent over the internet.",
        a: "localStorage"
      },
      {
        q: "Adjust the rate, 'blank', volume, and voice synthesizer on the Settings page",
        a: "pitch"
      }
    ],
  },
  {
    name: 'Adding Your Own Decks',
    cards: [
      {
        q: "Save the current decks as a file by going to Settings and clicking the 'blank blank blank' button",
        a: "Download as JSON"
      },
      {
        q: "Add 'blank' and cards in your own JSON file, or by clicking the Create 'blank' button.",
        a: "decks"
      },
      {
        q: "Upload your own JSON of decks and cards by clicking the 'blank blank' button in Settings",
        a: "Choose File"
      },
      {
        q: "Click the 'blank' button to change the cards and title of a deck.",
        a: "edit"
      },
      {
        q: "Editing changes are saved 'blank'",
        a: "automatically"
      }
    ]
  },
  {
    name: "US Capitals",
    cards: [
      {q: "What is the capital of Alabama?", a: "Montgomery"},
      {q: "What is the capital of Alaska?", a: "Juneau"},
      {q: "What is the capital of Arizona?", a: "Phoenix"},
      {q: "What is the capital of Arkansas?", a: "Little Rock"},
      {q: "What is the capital of California?", a: "Sacramento"},
      {q: "What is the capital of Colorado?", a: "Denver"},
      {q: "What is the capital of Connecticut?", a: "Hartford"},
      {q: "What is the capital of Delaware?", a: "Dover"},
      {q: "What is the capital of Hawaii?", a: "Honolulu"},
      {q: "What is the capital of Florida?", a: "Tallahassee"},
      {q: "What is the capital of Georgia?", a: "Atlanta"},
      {q: "What is the capital of Idaho?", a: "Boise"},
      {q: "What is the capital of Illinois?", a: "Springfield"},
      {q: "What is the capital of Indiana?", a: "Indianapolis"},
      {q: "What is the capital of Iowa?", a: "Des Moines"},
      {q: "What is the capital of Kansas?", a: "Topeka"},
      {q: "What is the capital of Kentucky?", a: "Frankfort"},
      {q: "What is the capital of Louisiana?", a: "Baton Rouge"},
      {q: "What is the capital of Maine?", a: "Augusta"},
      {q: "What is the capital of Maryland?", a: "Annapolis"},
      {q: "What is the capital of Massachusetts?", a: "Boston"},
      {q: "What is the capital of Michigan?", a: "Lansing"},
      {q: "What is the capital of Minnesota?", a: "St. Paul"},
      {q: "What is the capital of Mississippi?", a: "Jackson"},
      {q: "What is the capital of Missouri?", a: "Jefferson City"},
      {q: "What is the capital of Montana?", a: "Helena"},
      {q: "What is the capital of Nebraska?", a: "Lincoln"},
      {q: "What is the capital of Nevada?", a: "Carson City"},
      {q: "What is the capital of New Hampshire?", a: "Concord"},
      {q: "What is the capital of New Jersey?", a: "Trenton"},
      {q: "What is the capital of New Mexico?", a: "Santa Fe"},
      {q: "What is the capital of North Carolina?", a: "Raleigh"},
      {q: "What is the capital of North Dakota?", a: "Bismarck"},
      {q: "What is the capital of New York?", a: "Albany"},
      {q: "What is the capital of Ohio?", a: "Columbus"},
      {q: "What is the capital of Oklahoma?", a: "Oklahoma City"},
      {q: "What is the capital of Oregon?", a: "Salem"},
      {q: "What is the capital of Pennsylvania?", a: "Harrisburg"},
      {q: "What is the capital of Rhode Island?", a: "Providence"},
      {q: "What is the capital of South Carolina?", a: "Columbia"},
      {q: "What is the capital of South Dakota?", a: "Pierre"},
      {q: "What is the capital of Tennessee?", a: "Nashville"},
      {q: "What is the capital of Texas?", a: "Austin"},
      {q: "What is the capital of Utah?", a: "Salt Lake City"},
      {q: "What is the capital of Vermont?", a: "Montpelier"},
      {q: "What is the capital of Virginia?", a: "Richmond"},
      {q: "What is the capital of Washington?", a: "Olympia"},
      {q: "What is the capital of West Virginia?", a: "Charleston"},
      {q: "What is the capital of Wisconsin?", a: "Madison"},
      {q: "What is the capital of Wyoming?", a: "Cheyenne"}
    ]
  },

  {
    "name": "Big-O Data Structure Access Time Complexities",
    "cards": [
      {
        "q": "What is the average access time complexity for an Array?",
        "a": "1"
      },
      {
        "q": "What is the average access time complexity for a Stack?",
        "a": "n"
      },
      {
        "q": "What is the average access time complexity for a Queue?",
        "a": "n"
      },
      {
        "q": "What is the average access time complexity for a Singly-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the average access time complexity for a Double-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the average access time complexity for a Skip List?",
        "a": "log n"
      },
      {
        "q": "What is the average access time complexity for a Hash Table?",
        "a": "n/a"
      },
      {
        "q": "What is the average access time complexity for a Binary Search Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average access time complexity for a Cartesian Tree?",
        "a": "n/a"
      },
      {
        "q": "What is the average access time complexity for a B-Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average access time complexity for a Red-Black Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average access time complexity for a Splay Tree?",
        "a": "n/a"
      },
      {
        "q": "What is the average access time complexity for a AVL Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average access time complexity for a KD Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst access time complexity for an Array?",
        "a": "1"
      },
      {
        "q": "What is the worst access time complexity for a Stack?",
        "a": "n"
      },
      {
        "q": "What is the worst access time complexity for a Queue?",
        "a": "n"
      },
      {
        "q": "What is the worst access time complexity for a Singly-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the worst access time complexity for a Double-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the worst access time complexity for a Skip List?",
        "a": "n"
      },
      {
        "q": "What is the worst access time complexity for a Hash Table?",
        "a": "n/a"
      },
      {
        "q": "What is the worst access time complexity for a Binary Search Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst access time complexity for a Cartesian Tree?",
        "a": "n/a"
      },
      {
        "q": "What is the worst access time complexity for a B-Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst access time complexity for a Red-Black Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst access time complexity for a Splay Tree?",
        "a": "n/a"
      },
      {
        "q": "What is the worst access time complexity for a AVL Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst access time complexity for a KD Tree?",
        "a": "n"
      }
    ]
  },
  {
    "name": "Big-O Data Structure Search Time Complexities",
    "cards": [
      {
        "q": "What is the average search time complexity for an Array?",
        "a": "n"
      },
      {
        "q": "What is the average search time complexity for a Stack?",
        "a": "n"
      },
      {
        "q": "What is the average search time complexity for a Queue?",
        "a": "n"
      },
      {
        "q": "What is the average search time complexity for a Singly-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the average search time complexity for a Double-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the average search time complexity for a Skip List?",
        "a": "log n"
      },
      {
        "q": "What is the average search time complexity for a Hash Table?",
        "a": "1"
      },
      {
        "q": "What is the average search time complexity for a Binary Search Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average search time complexity for a Cartesian Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average search time complexity for a B-Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average search time complexity for a Red-Black Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average search time complexity for a Splay Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average search time complexity for a AVL Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average search time complexity for a KD Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst search time complexity for an Array?",
        "a": "n"
      },
      {
        "q": "What is the worst search time complexity for a Stack?",
        "a": "n"
      },
      {
        "q": "What is the worst search time complexity for a Queue?",
        "a": "n"
      },
      {
        "q": "What is the worst search time complexity for a Singly-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the worst search time complexity for a Double-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the worst search time complexity for a Skip List?",
        "a": "n"
      },
      {
        "q": "What is the worst search time complexity for a Hash Table?",
        "a": "n"
      },
      {
        "q": "What is the worst search time complexity for a Binary Search Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst search time complexity for a Cartesian Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst search time complexity for a B-Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst search time complexity for a Red-Black Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst search time complexity for a Splay Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst search time complexity for a AVL Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst search time complexity for a KD Tree?",
        "a": "n"
      }
    ]
  },
  {
    "name": "Big-O Data Structure Insertion Time Complexities",
    "cards": [
      {
        "q": "What is the average insertion time complexity for an Array?",
        "a": "n"
      },
      {
        "q": "What is the average insertion time complexity for a Stack?",
        "a": "1"
      },
      {
        "q": "What is the average insertion time complexity for a Queue?",
        "a": "1"
      },
      {
        "q": "What is the average insertion time complexity for a Singly-Linked List?",
        "a": "1"
      },
      {
        "q": "What is the average insertion time complexity for a Double-Linked List?",
        "a": "1"
      },
      {
        "q": "What is the average insertion time complexity for a Skip List?",
        "a": "log n"
      },
      {
        "q": "What is the average insertion time complexity for a Hash Table?",
        "a": "1"
      },
      {
        "q": "What is the average insertion time complexity for a Binary Search Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average insertion time complexity for a Cartesian Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average insertion time complexity for a B-Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average insertion time complexity for a Red-Black Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average insertion time complexity for a Splay Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average insertion time complexity for a AVL Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average insertion time complexity for a KD Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst insertion time complexity for an Array?",
        "a": "n"
      },
      {
        "q": "What is the worst insertion time complexity for a Stack?",
        "a": "1"
      },
      {
        "q": "What is the worst insertion time complexity for a Queue?",
        "a": "1"
      },
      {
        "q": "What is the worst insertion time complexity for a Singly-Linked List?",
        "a": "1"
      },
      {
        "q": "What is the worst insertion time complexity for a Double-Linked List?",
        "a": "1"
      },
      {
        "q": "What is the worst insertion time complexity for a Skip List?",
        "a": "n"
      },
      {
        "q": "What is the worst insertion time complexity for a Hash Table?",
        "a": "n"
      },
      {
        "q": "What is the worst insertion time complexity for a Binary Search Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst insertion time complexity for a Cartesian Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst insertion time complexity for a B-Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst insertion time complexity for a Red-Black Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst insertion time complexity for a Splay Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst insertion time complexity for a AVL Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst insertion time complexity for a KD Tree?",
        "a": "n"
      }
    ]
  },
  {
    "name": "Big-O Data Structure Deletion Time Complexities",
    "cards": [
      {
        "q": "What is the average deletion time complexity for an Array?",
        "a": "n"
      },
      {
        "q": "What is the average deletion time complexity for a Stack?",
        "a": "1"
      },
      {
        "q": "What is the average deletion time complexity for a Queue?",
        "a": "1"
      },
      {
        "q": "What is the average deletion time complexity for a Singly-Linked List?",
        "a": "1"
      },
      {
        "q": "What is the average deletion time complexity for a Double-Linked List?",
        "a": "1"
      },
      {
        "q": "What is the average deletion time complexity for a Skip List?",
        "a": "log n"
      },
      {
        "q": "What is the average deletion time complexity for a Hash Table?",
        "a": "1"
      },
      {
        "q": "What is the average deletion time complexity for a Binary Search Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average deletion time complexity for a Cartesian Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average deletion time complexity for a B-Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average deletion time complexity for a Red-Black Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average deletion time complexity for a Splay Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average deletion time complexity for a AVL Tree?",
        "a": "log n"
      },
      {
        "q": "What is the average deletion time complexity for a KD Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst deletion time complexity for an Array?",
        "a": "n"
      },
      {
        "q": "What is the worst deletion time complexity for a Stack?",
        "a": "1"
      },
      {
        "q": "What is the worst deletion time complexity for a Queue?",
        "a": "1"
      },
      {
        "q": "What is the worst deletion time complexity for a Singly-Linked List?",
        "a": "1"
      },
      {
        "q": "What is the worst deletion time complexity for a Double-Linked List?",
        "a": "1"
      },
      {
        "q": "What is the worst deletion time complexity for a Skip List?",
        "a": "n"
      },
      {
        "q": "What is the worst deletion time complexity for a Hash Table?",
        "a": "n"
      },
      {
        "q": "What is the worst deletion time complexity for a Binary Search Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst deletion time complexity for a Cartesian Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst deletion time complexity for a B-Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst deletion time complexity for a Red-Black Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst deletion time complexity for a Splay Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst deletion time complexity for a AVL Tree?",
        "a": "log n"
      },
      {
        "q": "What is the worst deletion time complexity for a KD Tree?",
        "a": "n"
      }
    ]
  },
  {
    "name": "Big-O Data Structure Space Complexities",
    "cards": [
      {
        "q": "What is the worst space complexity for an Array?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a Stack?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a Queue?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a Singly-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a Double-Linked List?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a Skip List?",
        "a": "n log n"
      },
      {
        "q": "What is the worst space complexity for a Hash Table?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a Binary Search Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a Cartesian Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a B-Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a Red-Black Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a Splay Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a AVL Tree?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for a KD Tree?",
        "a": "n"
      }
    ]
  },
  {
    "name": "Big-O Data Structures",
    "cards": [
      {
        "q": "A data structure consisting of a collection of elements, each identified by at least one index. A 'blank' is stored such that the position of each element can be computed from its index tuple by a mathematical formula.",
        "a": "Array"
      },
      {
        "q": "A last in, first out, abstract data type that serves as a collection of elements.",
        "a": "Stack"
      },
      {
        "q": "A first in, first out, abstract data type that serves as a collection of elements.",
        "a": "Queue"
      },
      {
        "q": "A data structure containing nodes which have a 'value' field as well as 'next' field, which points to the next node in line of nodes.",
        "a": "Singly-Linked List"
      },
      {
        "q": "In a 'blank', each node contains, besides the next-node link, a second link field pointing to the previous node in the sequence.",
        "a": "Double-Linked List"
      },
      {
        "q": "A 'blank' is built in layers. The bottom layer, 1, is an ordinary ordered linked list. Each higher layer acts as an \"express lane\" for the lists below, where an element in layer i appears in layer i+1 with some fixed probability.",
        "a": "Skip List"
      },
      {
        "q": "A data structure that implements an associative array or dictionary. It is an abstract data type that maps keys to values. A hash table uses a hash function to compute an index, also called a hash code, into an array of buckets or slots, from which the desired value can be found. During lookup, the key is hashed and the resulting hash indicates where the corresponding value is stored.",
        "a": "Hash Table"
      },
      {
        "q": "A 'blank' is a rooted binary tree in which the nodes are arranged in total order in which the nodes with keys greater than any particular node is stored on the right sub-trees and the ones with equal to or less than are stored on the left sub-tree satisfying the 'blank' property",
        "a": "Binary Search Tree"
      },
      {
        "q": "A binary tree derived from a sequence of numbers; it can be uniquely defined from the properties that it is heap-ordered and that a symmetric (in-order) traversal of the tree returns the original sequence.",
        "a": "Cartesian Tree"
      },
      {
        "q": "A 'blank' of order m is a tree which satisfies the following properties:\n1. Every node has at most m children.\n2. Every internal node has at least m/2 children.\n3. Every non-leaf node has at least two children.\n4. All leaves appear on the same level.\n5. A non-leaf node with k children contains k−1 keys.",
        "a": "B-Tree"
      },
      {
        "q": "A kind of self-balancing binary search tree. Each node stores an extra bit representing \"color\", used to ensure that the tree remains balanced during insertions and deletions. When the tree is modified, the new tree is rearranged and \"repainted\" to restore the coloring properties that constrain how unbalanced the tree can become in the worst case. The properties are designed such that this rearranging and recoloring can be performed efficiently.",
        "a": "Red-Black Tree"
      },
      {
        "q": "A binary search tree with the additional property that recently accessed elements are quick to access again.",
        "a": "Splay Tree"
      },
      {
        "q": "The first self-balancing binary search tree to be invented. The heights of the two child subtrees of any node differ by at most one; if at any time they differ by more than one, rebalancing is done to restore this property.",
        "a": "AVL Tree"
      },
      {
        "q": "The 'blank' is a binary tree in which every node is a multi-dimensional point. Every non-leaf node can be thought of as implicitly generating a splitting hyperplane that divides the space into two parts, known as half-spaces. Points to the left of this hyperplane are represented by the left subtree of that node and points to the right of the hyperplane are represented by the right subtree.",
        "a": "KD Tree"
      }
    ]
  },
  {
    "name": "Big-O Sorting Algorithm Time Complexities",
    "cards": [
      {
        "q": "What is the best time complexity for Quicksort?",
        "a": "n log n"
      },
      {
        "q": "What is the best time complexity for Mergesort?",
        "a": "n log n"
      },
      {
        "q": "What is the best time complexity for Timsort?",
        "a": "n"
      },
      {
        "q": "What is the best time complexity for Heapsort?",
        "a": "n log n"
      },
      {
        "q": "What is the best time complexity for Bubble Sort?",
        "a": "n"
      },
      {
        "q": "What is the best time complexity for Insertion Sort?",
        "a": "n"
      },
      {
        "q": "What is the best time complexity for Selection Sort?",
        "a": "n squared"
      },
      {
        "q": "What is the best time complexity for Tree Sort?",
        "a": "n log n"
      },
      {
        "q": "What is the best time complexity for Shell Sort?",
        "a": "n log n"
      },
      {
        "q": "What is the best time complexity for Bucket Sort?",
        "a": "n + k"
      },
      {
        "q": "What is the best time complexity for Radix Sort?",
        "a": "n k"
      },
      {
        "q": "What is the best time complexity for Counting Sort?",
        "a": "n + k"
      },
      {
        "q": "What is the best time complexity for Cubesort?",
        "a": "n"
      },
      {
        "q": "What is the average time complexity for Quicksort?",
        "a": "n log n"
      },
      {
        "q": "What is the average time complexity for Mergesort?",
        "a": "n log n"
      },
      {
        "q": "What is the average time complexity for Timsort?",
        "a": "n log n"
      },
      {
        "q": "What is the average time complexity for Heapsort?",
        "a": "n log n"
      },
      {
        "q": "What is the average time complexity for Bubble Sort?",
        "a": "n squared"
      },
      {
        "q": "What is the average time complexity for Insertion Sort?",
        "a": "n squared"
      },
      {
        "q": "What is the average time complexity for Selection Sort?",
        "a": "n squared"
      },
      {
        "q": "What is the average time complexity for Tree Sort?",
        "a": " n log n"
      },
      {
        "q": "What is the average time complexity for Shell Sort?",
        "a": "n log n squared"
      },
      {
        "q": "What is the average time complexity for Bucket Sort?",
        "a": "n + k"
      },
      {
        "q": "What is the average time complexity for Radix Sort?",
        "a": "n k"
      },
      {
        "q": "What is the average time complexity for Counting Sort?",
        "a": "n + k"
      },
      {
        "q": "What is the average time complexity for Cubesort?",
        "a": "n log n"
      },
      {
        "q": "What is the worst time complexity for Quicksort?",
        "a": "n squared"
      },
      {
        "q": "What is the worst time complexity for Mergesort?",
        "a": "n log n"
      },
      {
        "q": "What is the worst time complexity for Timsort?",
        "a": "n log n"
      },
      {
        "q": "What is the worst time complexity for Heapsort?",
        "a": "n log n"
      },
      {
        "q": "What is the worst time complexity for Bubble Sort?",
        "a": "n squared"
      },
      {
        "q": "What is the worst time complexity for Insertion Sort?",
        "a": "n squared"
      },
      {
        "q": "What is the worst time complexity for Selection Sort?",
        "a": "n squared"
      },
      {
        "q": "What is the worst time complexity for Tree Sort?",
        "a": "n squared"
      },
      {
        "q": "What is the worst time complexity for Shell Sort?",
        "a": "n log n squared"
      },
      {
        "q": "What is the worst time complexity for Bucket Sort?",
        "a": "n squared"
      },
      {
        "q": "What is the worst time complexity for Radix Sort?",
        "a": "n k"
      },
      {
        "q": "What is the worst time complexity for Counting Sort?",
        "a": "n + k"
      },
      {
        "q": "What is the worst time complexity for Cubesort?",
        "a": "n log n"
      }
    ]
  },
  {
    "name": "Big-O Sorting Algorithm Space Complexities",
    "cards": [
      {
        "q": "What is the worst space complexity for Quicksort?",
        "a": "log n"
      },
      {
        "q": "What is the worst space complexity for Mergesort?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for Timsort?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for Heapsort?",
        "a": "1"
      },
      {
        "q": "What is the worst space complexity for Bubble Sort?",
        "a": "1"
      },
      {
        "q": "What is the worst space complexity for Insertion Sort?",
        "a": "1"
      },
      {
        "q": "What is the worst space complexity for Selection Sort?",
        "a": "1"
      },
      {
        "q": "What is the worst space complexity for Tree Sort?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for Shell Sort?",
        "a": "1"
      },
      {
        "q": "What is the worst space complexity for Bucket Sort?",
        "a": "n"
      },
      {
        "q": "What is the worst space complexity for Radix Sort?",
        "a": "n + k"
      },
      {
        "q": "What is the worst space complexity for Counting Sort?",
        "a": "k"
      },
      {
        "q": "What is the worst space complexity for Cubesort?",
        "a": "n"
      }
    ]
  },
  {
    "name": "Big-O Sorting Algorithms",
    "cards": [
      {
        "q": "Slightly faster than merge sort and heapsort for randomized data, particularly on larger distributions. 'Blank' is a divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. For this reason, it is sometimes called partition-exchange sort. The sub-arrays are then sorted recursively. This can be done in-place, requiring small additional amounts of memory to perform the sorting.",
        "a": "Quicksort"
      },
      {
        "q": "'Blank' works as follows:\n1. Divide the unsorted list into n sublists, each containing one element (a list of one element is considered sorted).\n2. Repeatedly concatenate sublists to produce new sorted sublists until there is only one sublist remaining. This will be the sorted list.",
        "a": "Mergesort"
      },
      {
        "q": "Derived from merge sort and insertion sort, designed to perform well on many kinds of real-world data.",
        "a": "Timsort"
      },
      {
        "q": "An improved selection sort: divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region. Unlike selection sort, does not waste time with a linear-time scan of the unsorted region; rather, heap sort maintains the unsorted region in a 'blank' data structure to more quickly find the largest element in each step.",
        "a": "Heapsort"
      },
      {
        "q": "A simple sorting algorithm that repeatedly steps through the input list element by element, comparing the current element with the one after it, swapping their values if needed. These passes through the list are repeated until no swaps had to be performed during a pass.",
        "a": "Bubble Sort"
      },
      {
        "q": "A simple sorting algorithm that builds the final sorted list one item at a time by comparisons.",
        "a": "Insertion Sort"
      },
      {
        "q": "An in-place comparison sorting algorithm. Inefficient on large lists, and generally performs worse than the similar insertion sort. 'Blank' is noted for its simplicity and has performance advantages over more complicated algorithms in certain situations, particularly where auxiliary memory is limited.",
        "a": "Selection Sort"
      },
      {
        "q": "A sort algorithm that builds a binary search tree from the elements to be sorted, and then traverses the tree (in-order) so that the elements come out in sorted order.",
        "a": "Tree Sort"
      },
      {
        "q": "An in-place comparison sort. It can be seen as either a generalization of sorting by exchange (bubble sort) or sorting by insertion (insertion sort). The method starts by sorting pairs of elements far apart from each other, then progressively reducing the gap between elements to be compared. By starting with far apart elements, it can move some out-of-place elements into position faster than a simple nearest neighbor exchange.",
        "a": "Shell Sort"
      },
      {
        "q": "A sorting algorithm that works by distributing the elements of an array into a number of 'blank'. Each 'blank' is then sorted individually, either using a different sorting algorithm, or by recursively applying the 'blank' sorting algorithm.",
        "a": "Bucket Sort"
      },
      {
        "q": "A non-comparative sorting algorithm. It avoids comparison by creating and distributing elements into buckets according to their 'blank'. For elements with more than one significant digit, this bucketing process is repeated for each digit, while preserving the ordering of the prior step, until all digits have been considered.",
        "a": "Radix Sort"
      },
      {
        "q": "An integer sorting algorithm. It operates by counting the number of objects that possess distinct key values, and applying prefix sum on those counts to determine the positions of each key value in the output sequence.",
        "a": "Counting Sort"
      },
      {
        "q": "A parallel sorting algorithm that builds a self-balancing multi-dimensional array from the keys to be sorted. After each key is inserted it can be rapidly converted to an array.",
        "a": "Cubesort"
      }
    ]
  }
];
if (typeof localStorage.getItem('decks') === 'string') {
  d = JSON.parse(localStorage.getItem('decks')).decks; // overwrite default decks with saved decks
}
var lss = {};
if (typeof localStorage.getItem('settings') === 'string') {
  lss = JSON.parse(localStorage.getItem('settings')); // get localStorage settings
}

var s = { // s means Settings, applying localStorage settings or using a default value
  rate: typeof lss.rate === 'string' ? lss.rate : '1',
  pitch: typeof lss.pitch === 'string' ? lss.pitch : '1',
  volume: typeof lss.volume === 'string' ? lss.volume : '1',
  voiceName: typeof lss.voiceName === 'string' ? lss.voiceName : '',
  theme: typeof lss.theme === 'string' ? lss.theme : 'gameboy',
  caseSensitive: typeof lss.caseSensitive === 'string' ? lss.caseSensitive : 'insensitive'
}

document.body.className = s.theme;


if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
// ====end Data====

// ====start Functions====
function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
    if ( aname < bname ) return -1;
    else if ( aname == bname ) return 0;
    else return +1;
  });
  if (voices.length > 0) {
    if (s.voiceName === '') {
      if (localStorage.getItem('settings') && localStorage.getItem('settings').voice) {
        s.voiceName = localStorage.getItem('settings').voice;
      } else {
        s.voiceName = voices[0].name;
      }
    }
    voice = getVoice();
    m.redraw();
  }
}

function voiceSelectOptionsChange() {
  var voiceSelect = document.getElementById('voice_select');
  if(voiceSelect.options.length > 0 && voiceSelect.options.length >= voices.length) {
    voiceSelect.options[voices.indexOf(voice)].selected = true;
  }
}

function voiceSelectOnUpdate() {
  if (voices.length > 0 && voices.length !== prevVoiceLength) {
    voiceSelectOptionsChange();
  }
  prevVoiceLength = voices.length;
}

function setNextQuestion() {
  g.feedback = "";
  g.answerAttempt = "";
  g.answerSubmitted = false;
  if (g.qaPairs.length > 0) {
    g.qaPairIndex = Math.floor(Math.random() * g.qaPairs.length);
    g.qaPair = g.qaPairs[g.qaPairIndex];
    g.question = g.qaPair.q;
    g.answer = g.qaPair.a;
    speak(g.question);
  } else {
    clearGame();
    g.feedback = "Congratulations! You've Actively Recalled every concept!"
    speak(g.feedback);
  }
  m.redraw();
}

function setButtonHighlight(buttonName) {
  document.getElementById('game_btn').classList.remove("btn_highlight");
  document.getElementById('decks_btn').classList.remove("btn_highlight");
  document.getElementById('settings_btn').classList.remove("btn_highlight");
  document.getElementById(buttonName).classList.add("btn_highlight");
}

function cloneObj(orig) {
  return JSON.parse(JSON.stringify(orig));
}

function clearGame() {
  g.question = "";
  g.answer = "";
  g.answerAttempt = "";
  g.feedback = "";
  g.qaPairs = [];
  g.qaPair = {};
  g.qaPairIndex = 0;
  g.inProgress = false;
  g.correctCount = 0;
  g.incorrectCount = 0;
}
  
function loadGame(deck) {
  clearGame();
  g.inProgress = true;
  g.qaPairs = cloneObj(deck);
  setNextQuestion();
}

function submitAnswer() {
  if (g.inProgress) {
    if(!g.answerSubmitted) {
      g.answerSubmitted = true;
      if (g.answerAttempt === g.answer || (s.caseSensitive === 'insensitive' && g.answerAttempt.toLowerCase() === g.answer.toLowerCase())) {
        g.qaPairs.splice(g.qaPairs.indexOf(g.qaPair), 1);
        g.correctCount++;
        g.feedback = `"${g.answerAttempt}" is the correct answer!`;
      } else {
        g.incorrectCount++;
        g.feedback = `"${g.answerAttempt}" is incorrect. The correct answer is "${g.answer}"`;
      }
      speak(g.feedback, setNextQuestion);
    } else {
      synth.cancel();
      setNextQuestion();
    }
  } else {
    g.question = 'Select a deck to play';
    speak(g.question);
    m.route.set('/decks');
  }
}

function getVoice() {
  for(i = 0; i < voices.length ; i++) {
    if(voices[i].name === s.voiceName) {
      return voices[i];
    }
  }
}

function speak(text, onend){
  if (synth.speaking) {
    synth.cancel();
  }
  if (text !== '' && s.voiceName !== '') {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = function (event) {
      if (typeof onend === 'function') {
        onend(event);
      }
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    utterThis.voice = getVoice();
    utterThis.pitch = s.pitch;
    utterThis.rate = s.rate;
    utterThis.volume = s.volume;
    synth.speak(utterThis);
  }
}

function createNewDeck() {
  d.push({
    name: 'New Deck',
    cards: [
      {
        q: '',
        a: ''
      }
    ]
  });
}

function saveDeck(updatedDeck, updatedDeckIndex) {
  if (typeof updatedDeck !== 'undefined' && typeof updatedDeckIndex !== 'undefined') {
    d[updatedDeckIndex] = updatedDeck;
  }
  localStorage.setItem('decks', JSON.stringify({decks: d}));
}

function removeDeck(deckIndex) {
  d.splice(deckIndex, 1);
}

function createNewCard(cardsArr) {
  cardsArr.push({
    q: '',
    a: ''
  });
}

function removeCard(cardsArr, cardIndex) {
  cardsArr.splice(cardIndex, 1)
}

function importDecks(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    var importText = event.target.result;
    localStorage.setItem('decks', importText);
    d = JSON.parse(importText).decks;
    clearGame();
    m.route.set('/decks');
  });
  reader.readAsText(file);
}

function exportDecks() {
  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
  download(JSON.stringify({decks: d}), 'active_recall_decks.json', 'application/json');
}
// ====end Functions====

// ====start Mithril Components====
var Main = {
  view: function() {
    return m("main", [
      m(Header),
      m("div", {id: "content"}, [
        
      ])
    ])
  }
}

var Header = {
  view: function() {
    return m("header", [
      m("h1", "Active Recall"),
      m('div', [
        m('button', {id: 'game_btn', onclick: function() {m.route.set("/game")}}, "Game"),
        m('button', {id: 'decks_btn', onclick: function() {m.route.set("/decks")}}, "Decks"),
        m('button', {id: 'settings_btn', onclick: function() {m.route.set("/settings")}}, "Settings")
      ])
    ]);
  }
};

var Game = {
  oncreate: function() {
    setButtonHighlight('game_btn');
    if (!g.inProgress) {
      g.question = 'Select a deck to play';
      // m.redraw();
    }
  },
  view: function() {
    return m("section", {class: 'game_section'}, [
      m(scoreBoard),
      m(gameBoard)
    ])
  }
}

var scoreBoard = {
  view: function() {
    return m('div', {class: 'score_board'}, [
      m('h3', 'Scoreboard'),
      m('p', [
        m('span', 'Remaining'),
        m('span', g.qaPairs.length)
      ]),
      m('p', [
        m('span', 'Correct'),
        m('span', g.correctCount)
      ]),
      m('p', [
        m('span', 'Incorrect'),
        m('span', g.incorrectCount)
      ])
    ]);
  }
};

var gameBoard = {
  view: function() {
    return m('div', {class: 'game_board'}, [
      m("p", {class: "question"}, g.question),
      m(answerForm),
      m("p", {class: "feedback"}, g.feedback)
    ]);
  }
};

var answerForm = {
  view: function() {
      return m("form", {
        onsubmit: function(e) {
            e.preventDefault();
            submitAnswer(e);
        }
      }, [
          m("input.input[type=text][placeholder=Type answer here...][autocomplete=off]", {
            oncreate: function() {document.getElementById('answer_attempt').focus()},
            oninput: function (e) {g.answerAttempt = e.target.value},
            value: g.answerAttempt,
            id: "answer_attempt"
        }),
          m("button.button[type=submit]", "Submit"),
      ])
  }
}

var Decks = {
  oncreate: function() {
    setButtonHighlight('decks_btn');
  },
  view: function() {
    return m('div', {class: 'decks_container'},
    [
      // m('h2', 'Decks'),
      d.map(function(i, iIndex) {
        return m("div", {class: 'deck_container'}, [
        m('div', {class: 'flex-row'}, [
          m('h3', i.name),
          m('span', {class: 'card_count'}, i.cards.length + ' Cards')
        ]),
        m('div', {class: 'flex-row'}, [
          m('button', {
            class: 'inverse',
            onclick: function(){
              clearGame();
              removeDeck(iIndex);
              saveDeck();
              m.redraw();
            } 
          }, 'Delete'),
          m('button', {
            class: 'inverse',
            onclick: function(){
              clearGame();
              m.route.set('/edit/' + d.indexOf(i));
            } 
          }, 'Edit'),
          m('button', {
            onclick: function() {
              loadGame(i.cards);
              m.route.set('/game')
            }
          }, 'Play')
        ]),
      ])}),
      m("div", {class: 'deck_container'}, [
        m('button', {
          onclick: function() {
            createNewDeck();
            m.redraw();
          }
        }, 'Create New Deck')
      ])
    ]);
  }
};

var Edit = {
  oninit: function(vnode) {
    deckIndex = vnode.attrs.index;
    deck = cloneObj(d[deckIndex]);
  },
  view: function() {
    return m('div', {class: 'cards_container'},
    [
      m('div', {class: 'flex-row around'}, [
        m('h2', 'Deck Name'),
        m("input.input[type=text][autocomplete=off]", {
          oninput: function (e) {
            deck.name = e.target.value;
            saveDeck(deck, deckIndex);
            m.redraw();
          },
          value: deck.name,
          id: 'deck_name'
        }),
        m('button', {
          onclick: function() {
            loadGame(deck.cards);
            m.route.set('/game')
          }
        }, 'Play Deck')
      ]),
      deck.cards.map(function(card, index, deckArr) {
        return m('div', {class: 'card_container'}, [
        m("form", {
          onsubmit: function(e) {
            e.preventDefault();
          }
        }, [
          m('h3', 'Card ' + (index+1) + '/' + deckArr.length),
          m('p', 'Question'),
          m("textarea.textarea[autocomplete=off][placeholder=Type question here...][rows=5][columns=50]", {
            oncreate: function(vnode) {
              setTimeout(function() {
                vnode.dom.style.height = '';
                vnode.dom.style.height = vnode.dom.scrollHeight + 3 + 'px';
              }, 100);
            },
            oninput: function (e) {
              card.q = e.target.value;
              this.style.height = '';
              this.style.height = this.scrollHeight + 3 + 'px';
              saveDeck(deck, deckIndex);
              m.redraw();
            },
            value: card.q,
            id: "question" + index
          }),
          m('div', {class: 'flex-col'}, [
            m("button", {
              class: 'item-end',
              onclick: function() {
                speak(card.q);
              }
            }, "Test Speech")
          ]),
          m('p', {class: 'answer-label'}, 'Answer'),
          m("input.input[type=text][placeholder=Type answer here...][autocomplete=off]", {
            oninput: function (e) {
              card.a = e.target.value;
              saveDeck(deck, deckIndex);
              m.redraw();
            },
            value: card.a,
            id: "answer" + index
          }),
          m('div', {class: 'flex-row'}, [
            m("button", {
              class: 'inverse',
              onclick: function() {
                removeCard(deckArr, index);
                saveDeck(deck, deckIndex);
                m.redraw();
              }
            }, "Delete Card"),
            m("button", {
              onclick: function() {
                speak(card.a);
              }
            }, "Test Speech")
          ])
        ])
      ])}),
      m('div', {class: 'card_container'}, [
        m('button', {
          onclick: function() {
            createNewCard(deck.cards);
            saveDeck(deck, deckIndex);
            m.redraw();
          }
        }, 'Create New Card')
      ])
    ]);
  }
};

var Settings = {
  oncreate: function() {
    setButtonHighlight('settings_btn');
  },
  view: function() {
    return m("section", {id: "settings"}, [
      // m('h2', 'Settings'),
      m(speechSynthesisOptions),
      m(ImportExport),
      m(themeOptions),
      m(caseSensitivityOptions),
      m(problemsSection)
    ]);
  }
};

var speechSynthesisOptions = {
  oncreate: function() {
    populateVoiceList();
  },
  view: function() {
    return m("form", {class: "voice_options"}, [
      m("h3", "Voice Options"),
      m("p", {class: "label_container rate"}, [
        m("label.label[for=rate]", "Rate"),
        m("span", {class: "value rate"}, s.rate),
      ]),
      m("input.input[type=range][min=0.5][max=2][step=0.1][id=rate]",
        {
          id: "rate",
          class: "speech_range",
          value: s.rate,
          onchange: e => {
            s.rate = e.target.value;
            localStorage.setItem('settings', JSON.stringify(s));
            speak(voiceTestString);
          }
        }
      ),
      m("p", {class: "label_container pitch"}, [
        m("label.label[for=pitch]", "Pitch"),
        m("span", {class: "value pitch"}, s.pitch),
      ]),
      m("input.input[type=range][min=0][max=2][step=0.1][id=pitch]",
        {
          id: "pitch",
          class: "speech_range",
          value: s.pitch,
          onchange: e => {
            s.pitch = e.target.value;
            localStorage.setItem('settings', JSON.stringify(s));
            speak(voiceTestString);
          }
        }
      ),
      m("p", {class: "label_container volume"}, [
        m("label.label[for=volume]", "Volume"),
        m("span", {class: "value volume"}, s.volume),
      ]),
      m("input.input[type=range][min=0][max=1][step=0.1][id=volume]",
        {
          id: "volume",
          class: "speech_range",
          value: s.volume,
          onchange: e => {
            s.volume = e.target.value;
            localStorage.setItem('settings', JSON.stringify(s));
            speak(voiceTestString);
          }
        }
      ),
      m('label[for=voice]', {class: "voice_label"}, 'Voice'),
      m('select[name=voice]', {
        value: s.voiceName,
        id: 'voice_select',
        onchange: e => {
          s.voiceName = voices[e.target.selectedIndex].name;
          localStorage.setItem('settings', JSON.stringify(s));
          speak(voiceTestString);
        },
        onupdate: voiceSelectOnUpdate
      }, [
        voices.map(i => m('option', { value: i.name, "data-lang": i.lang, "data-name": i.name }, i.name + ' (' + i.lang + ')' + (i.default ? " -- DEFAULT": '')))
      ])
    ]);
  }
};

var ImportExport = {
  view: function() {
    return m('div', {class: 'settings_option_container'}, [
        m('h3', 'Deck Options'),
        m('div', {class: 'import button_container'}, [
          m('label[for=import_file]', 'Import Decks'),
          m('input[type=file][id=import_file][name=import_file][accept=.json]',
          {
            onchange: function(e) {
              const fileList = event.target.files;
              if (fileList.length === 1) {
                importDecks(fileList[0]);
              }
            }
          })
        ]),
        m('div', {class: 'export button_container'}, [
          m('label[for=export_file]', 'Export Decks'),
          m('button', {name: 'export_file', onclick: exportDecks}, 'Download as JSON')
        ])
      ])
  }
};

var themeOptions = {
  oncreate: function() {
    document.getElementById(s.theme).checked = true;
  },
  view: function() {
    return m('div', {class: 'settings_option_container'}, [
      m('h3', 'Theme'),
      m('form', {
        class: 'radios_container',
        value: s.theme,
        onchange: e => {
          console.log('radio form value', e.target.value);
          s.theme = e.target.value;
          localStorage.setItem('settings', JSON.stringify(s));
          document.body.className = s.theme;
        }
      }, [
        m('div', {class: 'radio_container'}, [
          m('label[for=gameboy]', 'GAME BOY'),
          m('input[type=radio][id=gameboy][name=theme][value=gameboy]')
        ]),
        m('div', {class: 'radio_container'}, [
          m('label[for=light]', 'Light'),
          m('input[type=radio][id=light][name=theme][value=light]')
        ]),
        m('div', {class: 'radio_container'}, [
          m('label[for=dark]', 'Dark'),
          m('input[type=radio][id=dark][name=theme][value=dark]')
        ])
      ])
    ]);
  }
};

var caseSensitivityOptions = {
  oncreate: function() {
    document.getElementById(s.caseSensitive).checked = true;
  },
  view: function() {
    return m('div', {class: 'settings_option_container'}, [
      m('h3', 'Case Sensitivity'),
      m('form', {
        class: 'radios_container',
        value: s.caseSensitive,
        onchange: e => {
          s.caseSensitive = e.target.value;
          localStorage.setItem('settings', JSON.stringify(s));
        }
      }, [
        m('div', {class: 'radio_container'}, [
          m('label[for=insensitive]', 'cAse InSeNsitivE'),
          m('input[type=radio][id=insensitive][name=theme][value=insensitive]')
        ]),
        m('div', {class: 'radio_container'}, [
          m('label[for=sensitive]', 'Case Sensitive'),
          m('input[type=radio][id=sensitive][name=theme][value=sensitive]')
        ])
      ])
    ]);
  }
};

var problemsSection = {
  view: function() {
    return m('div', {class: 'settings_option_container'}, [
      m('h3', 'Problems?'),
      m('span', [
        m('span', {class: 'settings_option_text'}, 'Make an issue '),
        m('a', {href: 'https://github.com/Mcmartelle/active_recall_js/issues'}, 'here')
      ])
    ]);
  }
};
// ====end Mithril Components====

// ====start Routing====
m.mount(root, Main);
m.route(document.getElementById('content'), "/decks", {
  "/decks": Decks,
  "/edit/:index": Edit,
  "/game": Game,
  "/settings": Settings
})

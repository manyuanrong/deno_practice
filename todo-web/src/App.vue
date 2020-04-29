<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="What needs to be done?"
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main" v-show="todos.length" v-cloak>
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone" />
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          class="todo"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo == editedTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.content }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-model="todo.content"
            v-todo-focus="todo == editedTodo"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length" v-cloak>
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize }} left
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility == 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility == 'active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility == 'completed' }">Completed</a>
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >Clear completed</button>
    </footer>
  </section>
</template>>

<script>
import Vue from "vue";

// localStorage persistence
const STORAGE_KEY = "todos-vuejs-2.0";

const todoStorage = {
  fetch: function() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") ?? [];
    todos.forEach(function(todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  }
};

// visibility filters
const todoFilters = {
  all: function(todos = []) {
    return todos;
  },
  active: function(todos = []) {
    return todos.filter(function(todo) {
      return !todo.completed;
    });
  },
  completed: function(todos = []) {
    return todos.filter(function(todo) {
      return todo.completed;
    });
  }
};

export default {
  // app initial state
  data() {
    return {
      todos: [],
      newTodo: "",
      editedTodo: null,
      visibility: "all"
    };
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function() {
      return todoFilters[this.visibility](this.todos);
    },
    remaining: function() {
      return todoFilters.active(this.todos).length;
    },
    allDone: {
      get: function() {
        return this.remaining === 0;
      },
      set: function(value) {
        this.todos.forEach(function(todo) {
          todo.completed = value;
        });
      }
    }
  },

  filters: {
    pluralize: function(n) {
      return n === 1 ? "item" : "items";
    }
  },

  mounted() {
    window.addEventListener("hashchange", this.onHashChange);
    this.onHashChange();
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    async load() {
      const todos = await fetch("/todos", { method: "GET" }).then(res =>
        res.json()
      );
      this.todos = todos;
    },
    onHashChange() {
      const visibility = window.location.hash.replace(/#\/?/, "");
      if (todoFilters[visibility]) {
        this.visibility = visibility;
      } else {
        window.location.hash = "";
        this.visibility = "all";
      }
      this.load();
    },
    addTodo: async function() {
      const value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.newTodo = "";
      await fetch("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: value,
          completed: false
        })
      });
      await this.load();
    },

    removeTodo: async function(todo) {
      await fetch("/todos/" + todo._id.$oid, { method: "DELETE" });
      await this.load();
    },

    editTodo: function(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },

    doneEdit: function(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.content = todo.contnet.trim();
      if (!todo.content) {
        this.removeTodo(todo);
      }
    },

    cancelEdit: function(todo) {
      this.editedTodo = null;
      todo.content = this.beforeEditCache;
    },

    removeCompleted: function() {
      this.todos = todoFilters.active(this.todos);
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    "todo-focus": function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
};
</script>
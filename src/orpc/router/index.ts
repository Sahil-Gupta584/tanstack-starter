import { addTodo, listTodos } from './todos'
import {
  getPlans,
  getSubscription,
  createCheckout,
  cancelSubscription,
  resumeSubscription,
} from './payments'

export default {
  listTodos,
  addTodo,
  billing: {
    getPlans,
    getSubscription,
    createCheckout,
    cancelSubscription,
    resumeSubscription,
  },
}

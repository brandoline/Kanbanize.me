import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Task, Contact, Category, InfoTec } from '../types'
import { User } from '@supabase/supabase-js'

export function useSupabaseData(user: User | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [infoTecs, setInfoTecs] = useState<InfoTec[]>([])
  const [loading, setLoading] = useState(true)

  // Default categories
  const defaultCategories: Category[] = [
    { id: crypto.randomUUID(), name: 'Geral', color: '#3B82F6' },
    { id: crypto.randomUUID(), name: 'Urgente', color: '#EF4444' },
    { id: crypto.randomUUID(), name: 'Projeto', color: '#10B981' },
  ]

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load categories first
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)

      if (categoriesError) throw categoriesError

      // If no categories exist, create default ones
      if (!categoriesData || categoriesData.length === 0) {
        const { data: newCategories, error: createError } = await supabase
          .from('categories')
          .insert(
            defaultCategories.map(cat => ({
              ...cat,
              user_id: user.id
            }))
          )
          .select()

        if (createError) throw createError
        setCategories(newCategories || defaultCategories)
      } else {
        setCategories(categoriesData.map(cat => ({
          id: cat.id,
          name: cat.name,
          color: cat.color
        })))
      }

      // Load other data in parallel
      const [tasksResult, contactsResult, infoTecsResult] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', user.id),
        supabase.from('contacts').select('*').eq('user_id', user.id),
        supabase.from('info_tecs').select('*').eq('user_id', user.id)
      ])

      if (tasksResult.error) throw tasksResult.error
      if (contactsResult.error) throw contactsResult.error
      if (infoTecsResult.error) throw infoTecsResult.error

      // Transform data to match frontend types
      setTasks((tasksResult.data || []).map(task => ({
        id: task.id,
        title: task.title,
        priority: task.priority,
        contactIds: task.contact_id ? [task.contact_id] : [],
        status: task.status,
        startDate: task.start_date,
        dueDate: task.due_date,
        attachments: task.attachments || [],
        notes: task.notes || '',
        lastUpdated: task.last_updated,
        categoryId: task.category_id,
        reminderEnabled: task.reminder_enabled || false,
        isInterrupted: task.is_interrupted || false
      })))

      setContacts((contactsResult.data || []).map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone || '',
        email: contact.email,
        institution: contact.institution || '',
        city: contact.city || '',
        position: contact.position || '',
        notes: contact.notes || '',
        isFaculty: contact.is_faculty || false,
        courses: contact.courses || undefined,
        sgnLink: contact.sgn_link || undefined,
        courseModality: contact.course_modality || undefined,
        classDays: contact.class_days || undefined,
        availableDays: contact.available_days || undefined,
        availableShifts: contact.available_shifts || undefined
      })))

      setInfoTecs((infoTecsResult.data || []).map(infoTec => ({
        id: infoTec.id,
        name: infoTec.name,
        period: infoTec.period,
        modality: infoTec.modality,
        color: infoTec.color,
        startDate: infoTec.start_date,
        studentDays: infoTec.student_days,
        classDays: infoTec.class_days,
        duration: infoTec.duration,
        priority: infoTec.priority
      })))

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveTask = async (task: Task) => {
    if (!user) return

    const taskData = {
      id: task.id,
      user_id: user.id,
      title: task.title,
      priority: task.priority,
      contact_id: task.contactIds.length > 0 ? task.contactIds[0] : null,
      status: task.status,
      start_date: task.startDate,
      due_date: task.dueDate,
      attachments: task.attachments,
      notes: task.notes,
      last_updated: task.lastUpdated,
      category_id: task.categoryId,
      reminder_enabled: task.reminderEnabled,
      is_interrupted: task.isInterrupted
    }

    const { error } = await supabase
      .from('tasks')
      .upsert(taskData)

    if (error) throw error

    // Update local state
    setTasks(prev => {
      const existing = prev.find(t => t.id === task.id)
      if (existing) {
        return prev.map(t => t.id === task.id ? task : t)
      } else {
        return [...prev, task]
      }
    })
  }

  const deleteTask = async (taskId: string) => {
    if (!user) return

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id)

    if (error) throw error

    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const saveContact = async (contact: Contact) => {
    if (!user) return

    const contactData = {
      id: contact.id,
      user_id: user.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      institution: contact.institution,
      city: contact.city,
      position: contact.position,
      notes: contact.notes,
      is_faculty: contact.isFaculty,
      courses: contact.courses,
      sgn_link: contact.sgnLink,
      course_modality: contact.courseModality,
      class_days: contact.classDays,
      available_days: contact.availableDays,
      available_shifts: contact.availableShifts
    }

    const { error } = await supabase
      .from('contacts')
      .upsert(contactData)

    if (error) throw error

    setContacts(prev => {
      const existing = prev.find(c => c.id === contact.id)
      if (existing) {
        return prev.map(c => c.id === contact.id ? contact : c)
      } else {
        return [...prev, contact]
      }
    })
  }

  const deleteContact = async (contactId: string) => {
    if (!user) return

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', user.id)

    if (error) throw error

    setContacts(prev => prev.filter(c => c.id !== contactId))
    
    // Update tasks to remove contact reference (set to empty array since we only support one contact)
    setTasks(prev => prev.map(task =>
      task.contactIds.includes(contactId)
        ? { ...task, contactIds: [] }
        : task
    ))
  }

  const saveCategory = async (category: Category) => {
    if (!user) return

    const categoryData = {
      id: category.id,
      user_id: user.id,
      name: category.name,
      color: category.color
    }

    const { error } = await supabase
      .from('categories')
      .upsert(categoryData)

    if (error) throw error

    setCategories(prev => {
      const existing = prev.find(c => c.id === category.id)
      if (existing) {
        return prev.map(c => c.id === category.id ? category : c)
      } else {
        return [...prev, category]
      }
    })
  }

  const deleteCategory = async (categoryId: string) => {
    if (!user || categories.length <= 1) return

    const firstRemainingCategory = categories.find(c => c.id !== categoryId)
    if (!firstRemainingCategory) return

    // Move tasks to first remaining category
    const tasksToUpdate = tasks.filter(t => t.categoryId === categoryId)
    for (const task of tasksToUpdate) {
      await saveTask({ ...task, categoryId: firstRemainingCategory.id })
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('user_id', user.id)

    if (error) throw error

    setCategories(prev => prev.filter(c => c.id !== categoryId))
  }

  const saveInfoTec = async (infoTec: InfoTec) => {
    if (!user) return

    const infoTecData = {
      id: infoTec.id,
      user_id: user.id,
      name: infoTec.name,
      period: infoTec.period,
      modality: infoTec.modality,
      color: infoTec.color,
      start_date: infoTec.startDate,
      student_days: infoTec.studentDays,
      class_days: infoTec.classDays,
      duration: infoTec.duration,
      priority: infoTec.priority
    }

    const { error } = await supabase
      .from('info_tecs')
      .upsert(infoTecData)

    if (error) throw error

    setInfoTecs(prev => {
      const existing = prev.find(i => i.id === infoTec.id)
      if (existing) {
        return prev.map(i => i.id === infoTec.id ? infoTec : i)
      } else {
        return [...prev, infoTec]
      }
    })
  }

  const deleteInfoTec = async (infoTecId: string) => {
    if (!user) return

    const { error } = await supabase
      .from('info_tecs')
      .delete()
      .eq('id', infoTecId)
      .eq('user_id', user.id)

    if (error) throw error

    setInfoTecs(prev => prev.filter(i => i.id !== infoTecId))
  }

  return {
    tasks,
    contacts,
    categories,
    infoTecs,
    loading,
    saveTask,
    deleteTask,
    saveContact,
    deleteContact,
    saveCategory,
    deleteCategory,
    saveInfoTec,
    deleteInfoTec,
    refreshData: loadData
  }
}
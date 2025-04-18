'use client'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { postRequest } from '@/api/api'
import { Button } from '@/components/ui/button'
import FileUploadDialog from '../FileUploadDialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData extends { promotion?: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onAdd?: () => void
  onDelete?: (rows: TData[]) => void
}

export function DataTable<TData extends { promotion?: string }, TValue>({
  columns,
  data,
  onAdd,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [promotions, setPromotions] = useState<string[]>([])
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Récupère les promotions pour le champ ajout d un apprenti
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await postRequest('cursus/promotions')
        const promotions = response.promotions.map(
          (promotion: any) => promotion.promotion_name,
        )
        setPromotions(promotions)
      } catch (error) {
        console.error('Error fetching promotions:', error)
      }
    }
    fetchPromotions()
  }, [])

  const handleAddPromotion = () => {
    console.log('Add promotion')
    setIsFileUploadDialogOpen(true)
  }

  const handleDeleteUsers = () => {
    if (onDelete) {
      onDelete(selectedRows)
    }
    table.resetRowSelection()
  }

  const handleResetFilters = () => {
    table.getColumn('email')?.setFilterValue('')
    table.getColumn('role')?.setFilterValue('')
    table.getColumn('promotion')?.setFilterValue('')
  }

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)

  return (
    <div>
      <FileUploadDialog
        isOpen={isFileUploadDialogOpen}
        onClose={() => setIsFileUploadDialogOpen(false)}
      />
      <div className='h-full w-full p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Input
              placeholder='Filtrer emails...'
              value={
                (table.getColumn('email')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('email')?.setFilterValue(event.target.value)
              }
              className='max-w-sm border border-gray-300 text-black placeholder-gray-500 rounded-lg'
            />
            <span className='text-black whitespace-nowrap ml-2'>Filtres :</span>
            <select
              value={
                (table.getColumn('role')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('role')?.setFilterValue(event.target.value)
              }
              className='bg-[#f3f4f6] max-w-sm text-center border h-10 w-80 border-gray-300 text-black rounded-lg focus:outline-none'
            >
              <option value=''>Rôles</option>
              <option value='admins'>Administrateur</option>
              <option value='apprentice_masters'>
                Maîtres d&apos;apprentissage
              </option>
              <option value='educational_tutors'>Tuteurs pédagogiques</option>
              <option value='apprentices'>Apprentis</option>
              <option value='professionals'>Professionnels</option>
              <option value='teachers'>Professeurs</option>
            </select>
            <select
              value={
                (table.getColumn('promotion')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('promotion')?.setFilterValue(event.target.value)
              }
              className='bg-[#f3f4f6] max-w-sm text-center border h-10 w-80 border-gray-300 text-black rounded-lg focus:outline-none'
            >
              <option value=''>Promotions</option>
              {promotions.map((promotion) => (
                <option key={promotion} value={promotion}>
                  {promotion}
                </option>
              ))}
            </select>
            <Button onClick={handleResetFilters} className='ml-2'>
              Réinitialiser les filtres
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            {onDelete && selectedRows.length > 0 && (
              <Button variant='destructive' onClick={handleDeleteUsers}>
                <Trash2 className='mr-2 h-4 w-4' />
                Supprimer {selectedRows.length} élément(s)
              </Button>
            )}
            {onAdd && (
              <div className='flex justify-between mb-4 bg-green-500 rounded-lg mt-4'>
                <Button
                  onClick={onAdd}
                  className='bg-green-500 hover:bg-green-600 rounded-l-lg shadow-none'
                >
                  <Plus className='mr-2 h-4 w-4 rounded-none shadow-none' />{' '}
                  Ajouter
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='h-full w-8 hover:bg-green-600 focus:outline-none'
                    >
                      <ChevronDown className='h-full w-auto text-white' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem onSelect={handleAddPromotion}>
                      Ajouter une promo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='ml-auto'>
                  Colonnes <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className='rounded-md border border-gray-300'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    Pas de résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-between space-x-2 py-4'>
          <div className='flex-1 text-sm text-muted-foreground'>
            {table.getFilteredSelectedRowModel().rows.length} sur{' '}
            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
          </div>
          <div className='space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédent
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

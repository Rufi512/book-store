import { Request,Response } from "express"
import axios from "axios"
import cheerio from "cheerio"
import { Book } from "../types/types"
export const list = async (req:Request,res:Response) =>{
	try{
		const {q, p} = req.query
		if(!Number(p)) return res.status(400).json({message:'la query p (pagina) no es un numero'})
		const request = await axios.get(`https://www.goodreads.com/search?page=${p}&q=${q}`)
		const $ = cheerio.load(request.data)
		const list_books = $('.leftContainer .tableList tr')
		let books:Book[] = []
		list_books.each((_i:Number,el)=>{
			const book_title = $(el).find('.bookTitle span').html() || ''
			const book_cover = $(el).find('.bookCover').attr('src')
			const author = $(el).find('.authorName span').html() || ''
			const link = $(el).find('.bookTitle').attr('href') || ''
			const published = $(el).find('.greyText').contents().filter((_,e) => e.type === "text" && e.data?.includes('published') || false).text().trim().replace(/[— \ n]/g,'')
			const rating = $(el).find('.greyText .minirating').text().substring(0,6).trim()
			books.push({
                title: book_title,
                image: `${book_cover?.substring(0, book_cover.length - 11)}${book_cover?.substring(book_cover.length - 4, book_cover.length)}`,
                author,
                published,
                id: link.split(/[/ ?]/g)[3],
                rating
            });
		})
		return res.json(books)
	}catch(e){
		console.log(e)
		return res.status(404).json({message:"No se han obtenido resultados :("})
	}
	
}

export const book = async (req:Request,res:Response) =>{
	try{
		if(!req.params.id) return res.status(404).json({message:'No se ha obtenido el id del libro'})
		const request = await axios.get(`https://www.goodreads.com/book/show/${req.params.id}`)
		const $ = cheerio.load(request.data)
		const book_title = $('.leftContainer #topcol #bookTitle').text().trim()
		let book_author = ''
	 	$(".leftContainer #topcol #metacol #bookAuthors .authorName__container").each((_,el)=> book_author += $(el).text().trim() )
		const book_cover = $('.leftContainer #topcol #imagecol .bookCoverContainer #coverImage').attr('src')
		const book_description = $('.leftContainer #topcol #metacol #descriptionContainer #description span').last().text()
		const book_rating = $(".leftContainer #topcol #metacol #bookMeta span[itemprop = 'ratingValue']").text().trim()
		const published = $('.leftContainer #topcol #details .row').last().text().trim()
		const book_pages = $(".leftContainer #topcol #details .row span[itemprop = 'numberOfPages']").text().trim()
		const response: Book = {
			title: book_title,
			author: book_author,
			description: book_description,
			published,
			image: `${book_cover?.substring(0,book_cover.length - 12)}${book_cover?.substring(book_cover.length - 4, book_cover.length)}`,
			rating: book_rating,
			pages: book_pages,
	};
		return res.json(response)
	}catch(e){
		console.log(e)
		return res.status(404).json({'message':'No se ha encontrado el libro :('})
	}
}
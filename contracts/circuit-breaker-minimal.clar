;; Minimal Circuit Breaker Contract
;; Essential pause/unpause functionality only
;; Uses Clarity 4 features

(define-constant ERR-UNAUTHORIZED (err u1001))
(define-constant ERR-PAUSED (err u1002))
(define-constant ERR-NOT-PAUSED (err u1003))

(define-data-var paused bool false)
(define-data-var owner principal (as-contract tx-sender))

;; Events
(define-event pause-event (paused-by principal) (block-height uint))
(define-event unpause-event (unpaused-by principal) (block-height uint))

;; Helper: Check if caller is authorized
(define-private (is-authorized (caller principal))
	(begin
		(asserts! (is-eq caller (var-get owner)) ERR-UNAUTHORIZED)
		true
	)
)

;; Public: Pause the contract
(define-public (pause)
	(let ((caller tx-sender))
		(begin
			(asserts! (is-authorized caller) ERR-UNAUTHORIZED)
			(asserts! (not (var-get paused)) ERR-PAUSED)
			(var-set paused true)
			(ok (event-emit pause-event caller block-height))
		)
	)
)

;; Public: Unpause the contract
(define-public (unpause)
	(let ((caller tx-sender))
		(begin
			(asserts! (is-authorized caller) ERR-UNAUTHORIZED)
			(asserts! (var-get paused) ERR-NOT-PAUSED)
			(var-set paused false)
			(ok (event-emit unpause-event caller block-height))
		)
	)
)

;; Public: Check if contract is paused
(define-read-only (is-paused)
	(var-get paused)
)

;; Public: Get owner
(define-read-only (get-owner)
	(var-get owner)
)

;; Public: Transfer ownership
(define-public (transfer-ownership (new-owner principal))
	(let ((caller tx-sender))
		(begin
			(asserts! (is-authorized caller) ERR-UNAUTHORIZED)
			(asserts! (is-eq (var-get paused) false) ERR-PAUSED)
			(var-set owner new-owner)
			(ok true)
		)
	)
)

